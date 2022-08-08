import { ethers } from 'ethers'
const hre = require("hardhat")
//import { EthersAdapter ,EthSignSignature} from '@gnosis.pm/safe-core-sdk'
import EthersAdapter from '@gnosis.pm/safe-ethers-lib'

import Safe, { SafeFactory, SafeAccountConfig,EthSignSignature } from '@gnosis.pm/safe-core-sdk'
import { SafeTransactionData } from '@gnosis.pm/safe-core-sdk-types'

import SafeServiceClient, { SafeMultisigTransactionResponse } from '@gnosis.pm/safe-service-client'

import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { isLength } from 'lodash'


let  SAFE_TXN_URL = 'https://safe-transaction.rinkeby.gnosis.io'
let ethAdapter, safeSdkInstance, safeService, safeTransaction, executeTxResponse, safeTxHash, nonce;

 safeService = useMemo(() => new SafeServiceClient({txServiceUrl: SAFE_TXN_URL,ethAdapter }), [])

const  useSafeSdk = () => {
  const { query } = useRouter()
  const safeAddress = typeof query.safeAddress === 'string' ? query.safeAddress : ''
  const [safeSdk, setSafeSdk] = useState<Safe | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  
 


   //Safe transacytional info such as creation, exection approval 
  useEffect(() => {
    const createSdk = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const provider = new hre.ethers.providers.Web3Provider((window as any).ethereum)
      const signerData = provider.getSigner(0)
       ethAdapter = new EthersAdapter({
        ethers,
        signer: signerData,
      })

  
      safeSdkInstance = await Safe.create({
        ethAdapter,
        safeAddress,
        isL1SafeMasterCopy: true,
      })
     
      setSigner(signerData)
      setSafeSdk(safeSdkInstance)
    
    }

    createSdk()
    return () => {}
  }, [safeAddress])

  const isTxnExecutable = (safeThreshold: number, transaction: SafeMultisigTransactionResponse) => {
    return transaction.confirmations && transaction.confirmations.length >= safeThreshold
  }

  // Approve Transfer here
  // approve transfer here -use safe sdk 
  const approveTransfer = useCallback(
    async ({ safeTxHash, execTxn, hashTxn }: { safeTxHash: string; execTxn: Boolean, hashTxn: string }) => {
      const tx = await safeService.getTransaction(safeTxHash)

      if (safeSdk && tx) {
        if (!execTxn) {
          const hash = tx.safeTxHash
          const signature = await safeSdk.signTransactionHash(hash)
          await safeService.confirmTransaction(hash, signature.data)
        } else {

          
          const safeTransactionData: SafeTransactionData = {
            to: tx.to,
            value: tx.value,
            data: tx.data ? tx.data : '0x',
            operation: tx.operation,
            safeTxGas: tx.safeTxGas,
            baseGas: tx.baseGas,
            gasPrice: Number(tx.gasPrice),
            gasToken: tx.gasToken,
            refundReceiver: tx.refundReceiver ? tx.refundReceiver : '0x0000000000000000000000000000000000000000',
            nonce: tx.nonce,
          }
        
           // create transactions
          safeTransaction = await safeSdk.createTransaction(safeTransactionData)

          if (tx.confirmations) {
            tx.confirmations.forEach((confirmation) => {
              const signature = new EthSignSignature(confirmation.owner, confirmation.signature)
              safeTransaction.addSignature(signature)
            })
          }

          const executeTxResponse = await safeSdk.executeTransaction(safeTransaction)
          executeTxResponse.transactionResponse && (await executeTxResponse.transactionResponse.wait())
        }
      }
    },
    [safeSdk, safeService]
  )

  const rejectTransfer = useCallback(
    async ({ safeTxHash, execTxn, nonce, hashTxn}: { safeTxHash: string | null; execTxn: Boolean; nonce: number, hashTxn: string }) => {
      if (!safeTxHash) {
        if (safeSdk && signer) {
          const safeRejectionTransaction = await safeSdk.createRejectionTransaction(nonce)
          await safeSdk.signTransaction(safeRejectionTransaction)
          const safeRejectionTxHash = await safeSdk.getTransactionHash(safeRejectionTransaction)

          await safeService.proposeTransaction({
            safeAddress,
            safeTransaction: safeRejectionTransaction,
            safeTxHash: safeRejectionTxHash,
            senderAddress: await signer.getAddress(),
          })
        }
      } else {
        const tx = await safeService.getTransaction(safeTxHash)

        if (safeSdk && tx) {
          if (!execTxn) {
            const hash = tx.safeTxHash
            const signature = await safeSdk.signTransactionHash(hash)
            await safeService.confirmTransaction(hash, signature.data)
          } else {
            const safeTransactionData: SafeTransactionData = {
              to: tx.to,
              value: tx.value,
              data: tx.data ? tx.data : '0x',
              operation: tx.operation,
              safeTxGas: tx.safeTxGas,
              baseGas: tx.baseGas,
              gasPrice: Number(tx.gasPrice),
              gasToken: tx.gasToken,
              refundReceiver: tx.refundReceiver ? tx.refundReceiver : '0x0000000000000000000000000000000000000000',
              nonce: tx.nonce,
            }

              safeTransaction  = await safeSdk.createTransaction(safeTransactionData)
           

            if (tx.confirmations) {
              tx.confirmations.forEach((confirmation) => {
                const signature = new EthSignSignature(confirmation.owner, confirmation.signature)
                safeTransaction.addSignature(signature)
              })
            }

             executeTxResponse = await safeSdk.executeTransaction(safeTransaction)
            executeTxResponse.transactionResponse && (await executeTxResponse.transactionResponse.wait())
            alert(`Execution made for transaction:  ${hashTxn}`  )
                             

          }
        }
      }
    },
    [safeSdk, safeService, safeAddress, signer]
  )

  return { signer, safeSdk, safeService, safeTxHash,nonce,  safeAddress,safeTransaction, executeTxResponse, isTxnExecutable, approveTransfer, rejectTransfer }
}

export default useSafeSdk
    