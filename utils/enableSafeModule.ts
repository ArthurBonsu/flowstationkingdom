import { ethers } from 'ethers'
const hre = require ("hardhat")
import EthersAdapter from '@gnosis.pm/safe-ethers-lib'
//import ethAdaptername from  'utils/ethadapters'


import Safe, { SafeFactory, SafeAccountConfig,EthSignSignature, ContractNetworksConfig } from '@gnosis.pm/safe-core-sdk';

import SafeServiceClient, { ProposeTransactionProps, SafeInfoResponse } from '@gnosis.pm/safe-service-client'
import { SafeTransactionDataPartial } from '@gnosis.pm/safe-core-sdk-types'
import { moduleAbi } from '@constants/abi'


const MODULE_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string

//const safeService = new SafeServiceClient('https://safe-transaction.rinkeby.gnosis.io')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any

type ReturnType = {
  status: 'waiting' | 'success'
}
let  ethAdapter;
let  isCurrentUserAlreadySigned;

//Nuance problem, a transaction must be created on the blockchain for us to do a Gnosis safe to it .

// function for enablinng module, creates transactions and sends multiple transactions
// We could create several modules and create them with

const iface = new ethers.utils.Interface(moduleAbi)
const data = iface.encodeFunctionData('enableModule', [MODULE_ADDRESS])

export const enableModule = async (safeAddress: string) => {
  // Setting up the service providers 
  const web3Provider = window.ethereum
  const provider = new hre.ethers.providers.Web3Provider(web3Provider)
  const owner = provider.getSigner(0)
  
  const signedUser:string = await owner.getAddress()
  const signeduserstring:string  = signedUser.toString()
  

  // Setting up the Gnosis Safe Sdk For Multiwallet signings
  ethAdapter = new EthersAdapter({
    ethers,
    signer: owner
  })
   
  const safeFactory:SafeFactory = await SafeFactory.create({ ethAdapter   })
  const safeSdk:Safe = await Safe.create({ ethAdapter, safeAddress })

  // Initializing the safe  service itself
  const txServiceUrl:string = 'https://safe-transaction.rinkeby.gnosis.io'
  const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter })
  const { threshold }: SafeInfoResponse = await safeService.getSafeInfo(safeAddress)

   // The idea is a transaction will be creeated with the hash
   // The transactions will be created of an impending transaction object
   // The transaction object will be hashed 
   // THe transaction will then be created in the gnosis safe
   // The transaction will then be proposed 
   // The transaction will then be exectued
   // We will then receive the results of the signed transaction
   // THis is after the onsubmit is clicked, then the transaction hashing and execution is done by the gnosisi safe

    const transaction: SafeTransactionDataPartial ={
    to: safeAddress,
    value: '0',
    data,
  }

  const { data: transactionData } = transaction
  const multisigTransactions = await safeService.getMultisigTransactions(safeAddress)
  const sameTransaction = multisigTransactions.results.find(
    ({ data: transactionItem }) => transactionItem === transactionData
  )
  const isCurrentUserAlreadySigned = sameTransaction?.confirmations?.some(
    ({ owner: ownerItem }) => ownerItem === signedUser
  )

  if (isCurrentUserAlreadySigned) {
    return { status: 'waiting' }
  }


  // safe transaction with original transaction
 const safeTransaction  = await safeSdk.createTransaction(transaction)
 
 const nonce = await safeService.getNextNonce(safeAddress)
  

  // gets txhas
  // converted here as safe transaction
  const  safeTxHash = await safeSdk.getTransactionHash(safeTransaction)
  

  // sign, shows modal
  await safeSdk.signTransaction(safeTransaction)


  // proposes transactions 
   await safeService.proposeTransaction({
    safeAddress,
    safeTransaction,
    safeTxHash,
    senderAddress: await owner.getAddress(),
  })

  //  tries to make arrangement for confirmations 
  // prepares everything before we execute
  if (sameTransaction?.confirmations?.length) {
    if (threshold - sameTransaction.confirmations.length <= 1) {
      sameTransaction.confirmations.forEach((confirmation) => {
        const signature = new EthSignSignature(confirmation.owner, confirmation.signature)
        safeTransaction.addSignature(signature)
      })
      const { transactionResponse } = await safeSdk.executeTransaction(safeTransaction)
      await transactionResponse?.wait()
      return { status: 'success' }
    }
  }
  return { status: 'waiting', safeTxHash, nonce }

}

export default enableModule
