import { Button, ButtonProps, useDisclosure } from '@chakra-ui/react'
import AppAlertDialog from '@components/AppAlertDialog'


import useSafeSdk from 'hooks/useSafeSdk'
import { FC, useCallback, useState } from 'react'
import {SwapTransactionType} from 'types/index'
 

interface ApproveTransferProps extends ButtonProps {
  safeTxHash: string
  threshold: number
  execTxn: Boolean
  hashTxn : string

}



export interface SwapTokenTransaction{
  amount: number
  tokentxhash: string 
  tokenname: string
  symbol: string
  logoUri:string 
  signer:string
  txdata?: string
}

// We need to check if module has been enabled or not 

//Provides the informatin on transfer and offers for transfer 
const ApproveTransfer: FC<ApproveTransferProps> = ({ safeTxHash, threshold, execTxn,hashTxn, ...rest }) => {
  
  // const [isLoading, setIsLoading] = use
  const [isLoading, setIsLoading] = useState(false)
  const localDisclosure = useDisclosure()


  const { approveTransfer } = useSafeSdk()
  
  const handleSubmit = useCallback(async () => {
    setIsLoading(true)
    await approveTransfer({ safeTxHash, execTxn , hashTxn})

    /// STOP  LOADING 
    setIsLoading(false)
    localDisclosure.onClose()
    /// we  approve transactions  like this
  }, [approveTransfer, safeTxHash, execTxn,hashTxn,   localDisclosure])

  return (
    <>
      <Button colorScheme="blue" onClick={localDisclosure.onOpen} {...rest}>
        Approve
      </Button>
      <AppAlertDialog
        isLoading={isLoading}
        handleSubmit={handleSubmit}
        header="Approve Transaction"
        body= "This action will approve this transaction with  separate Transaction will be performed to submit the approval."
        disclosure={localDisclosure}
        /// An Onclose Event or function 
        customOnClose={() => {
          localDisclosure.onClose()
          setIsLoading(false)
        }}
      />
    </>
  )
}

export default ApproveTransfer
