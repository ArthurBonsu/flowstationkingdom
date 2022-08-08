import {
    Flex,
    Grid,
    Box,
    Input,
    Text,
    chakra, 
    Button,
    FormControl,
    FormLabel,
    NumberInputField,
    NumberInput,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    FormErrorMessage,
    InputGroup,
    InputRightAddon,
    useDisclosure,
    Stack ,
    RadioGroup,
    Radio, 
    Select,
    useProps,
    AlertDialog,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
   
       
  } from '@chakra-ui/react'
  import { useForm, useFieldArray,Controller, useWatch, useFormContext  } from 'react-hook-form'

  import { getLayout, WithPageLayout } from '@components/Layout'

  import AppModal from '@components/AppModal'
  import { ErrorMessage } from '@hookform/error-message'

  import { TCreateSwapFormSchema, createSwapFormSchema } from '../components/CreateTransfer/validation'
  import { yupResolver } from '@hookform/resolvers/yup';
  import * as yup from "yup";
  import { useCallback, useState, useEffect } from 'react' 
  import { setValues } from 'framer-motion/types/render/utils/setters'

  import useEthers  from '@hooks/useEthers'
  import { useEthersStore  } from '@stores/ethersStore'
  import {SwapTokenTransaction} from 'types/ethers'
  import hre, { ethers } from 'hardhat';
  import  fs from 'fs';
  import { TokenSwapcontractABI, TokenSwapcontractAddress } from 'constants/constants' 
  import { Signer, BigNumber, ContractFactory, Contract } from "ethers";
  import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';

  import { expect } from "chai";
  import chai   from "chai";
  import chaiaspromised from "chai-as-promised";
  import { Wallet } from "ethers";
import { TransactionResponse } from '@ethersproject/abstract-provider'

import useSafeInfo, { useSafe } from 'hooks/useSafe'
import useSafeSdk from 'hooks/useSafeSdk'
import {useSafeProps} from 'hooks/useSafe'
import { TransactionReceipt } from '@ethersproject/abstract-provider'
import { useSafeStore} from 'stores/safeStore'
import enableModule from '@utils/enableSafeModule'
import ApproveTransfer from '@components/ApproveTransfer'
import Safe, { SafeFactory, SafeAccountConfig,EthSignSignature, ContractNetworksConfig } from '@gnosis.pm/safe-core-sdk';

import SafeServiceClient, { ProposeTransactionProps, SafeInfoResponse } from '@gnosis.pm/safe-service-client'
import { SafeTransactionDataPartial } from '@gnosis.pm/safe-core-sdk-types'
import EthersAdapter from '@gnosis.pm/safe-ethers-lib'
import {TokenDepositvalue,   TokenType, TokenTypesDetails, SwapTransactionType } from 'types/index'
import AppAlertDialog from '@components/AppAlertDialog'
import Create from 'pages/create'
import Router from 'next/router'
import { useQuery } from 'react-query'
import queries from '@services/queries'
import getSafesWithoutModule from '@utils/getSafesWithoutModule'
import useTransaction from 'hooks/useTransactions'
import { useHashTransactionStore } from '@stores/transactionStore'
import CreateTransfer from 'components/CreateTransfer'



//import { BsCheckLg } from "react-icons/bs";
/*
return { signer, safeSdk, safeService, safeAddress,safeTransaction, executeTxResponse, isTxnExecutable, approveTransfer, rejectTransfer }
}
 */




/*
return {
  enableSafeModule,
  isLoading,
  safe,
  isCurrentUserAlreadySigned,
  refetch,
  hasReachedThreshold,
  executeSafeModule,
}
}

export default useSafe
*/






 // time for approval 
      // create transaction 
      // propose and ensure confirmations
      //  execute the transaction, or create transfer 
      // provide results
      // the receipients of the swap or the swap itself 
     // 


     // Things to do
     // Check for inputs
     // CHeck for sensistivity to schema
     //  Populate object into them


     
    interface newSafeAddress {
      safeAddress: string
      userAddress: string
    }



    // Hard Coded but we could set up a page where it can be put into it to be hardcoded
    const tokenLists: TokenType[] = [

    { amount: 0,
      tokenname: 'TokenBTC',
      symbol: 'TOKBTC',
      decimals: 100,
      logoUri: '0xef719f31e4F71392cDAda87E94e3a9C25Fce88B6'


    },

 
    {  
      amount: 0,
      tokenname: 'TokenABC',
      symbol: 'TABC',
      decimals: 100,
      logoUri: '0xd065dE9F870cb6a6C1A71120f5bF85CaDa2Ef862'
 
    },

    { 
      amount: 0,
      tokenname: 'TokenXYZ',
      symbol: 'TXYZ',
      decimals: 100,
      logoUri: '0x987F2B70576CC8BED9c1bbB09acCF324DC5a0EC4'

    }
  ]


 

   
  
   
      export const TokenSwapOriginal:  React.FC<SwapTransactionType> = ( {tokentxhash, nonce,amount,tokenname, symbol, logoUri}) => {

    // getting address and state of address
    const address = useEthersStore((state) => state.address)
    const provider = useEthersStore((state) => state.provider)
    const setAddress = useEthersStore((state) => state.setAddress)
    const setEtherStore = useEthersStore((state) => state.setEtherStore)
      
    const selectedSafe = useSafeStore((state) => state.selectedSafe)
    const isModuleEnabled = useSafeStore((state) => state.isModuleEnabled)
    const setIsModuleEnabled = useSafeStore((state) => state.setIsModuleEnabled)
  
      // Provider information to be provided
      const txhash  = useHashTransactionStore((state) => state.txhash)
      const txdata = useHashTransactionStore((state) => state.txdata)
      const logouri = useHashTransactionStore((state) => state.txlogoUri)
      const setHashTransaction = useHashTransactionStore((state) => state.setTransaction)
      const setHashTransactionData = useHashTransactionStore((state) => state.setTransactionData)
      const setHashTransactionTokenAmount = useHashTransactionStore((state) => state.setTransactionAmount)
      const setHashTransactionName = useHashTransactionStore((state) => state.setTransactionName)
      const setHashTransactionSymbol = useHashTransactionStore((state) => state.setTransactionSymbol)
      const setHashTransactionSigner = useHashTransactionStore((state) => state.setTransactionSigner)
      const setHashTransactionTxLogoUri = useHashTransactionStore((state) => state.setTransactionTxLogoUri)
      const walletAddress = useEthersStore((state) => state.address)
      const walletCheckSumAddress = walletAddress ? ethers.utils.getAddress(walletAddress) : ''
  
      const schema = yup.object({
        amount: yup.number().required(),
        tokentxhash: yup.string().required(), 
        tokenname:yup.string().required(),
        symbol: yup.string().required(),
        signer:yup.string().required(),
        
      }).required();


        const {onConnect,  onDisconnect } = useEthers()
        const usetranstransaction =   useTransaction({tokentxhash , nonce,amount,tokenname, symbol, logoUri})
        
  const {signer, safeSdk, safeService, safeAddress,safeTransaction, approveTransfer, rejectTransfer} = useSafeSdk()
  const { enableSafeModule, safe,isCurrentUserAlreadySigned,safeTxHash, status,  checkIsSigned,refetch,checkIfWaitingForExecution,hasReachedThreshold,executeSafeModule} = useSafe({safeAddress, userAddress:address } );
  setHashTransaction(txhash)       
  setHashTransactionData(txdata)   
  setHashTransactionTxLogoUri(logoUri)
  
  setHashTransactionSymbol(symbol)
  const { getDisclosureProps, getButtonProps } = useDisclosure()
  const localDisclosure = useDisclosure()
    
      const { isOpen, onOpen, onClose } = useDisclosure()
     
  const buttonProps = getButtonProps()
  const disclosureProps  = getDisclosureProps()
  

      const [isLoading, setIsLoading] = useState(false)
      const [isMultiSigSetup, setupMultisig] = useState(false)
      
      const [isSwapping, setIsSwapping] = useState(true)
     
      const [isTyping, setIsTyping] = useState(true)  
      const [transaction,setTransaction] = useState('')
      const [token, setToken] = useState('')
      const [value, setValue] = useState('')
  
      const [safemodule, setSafemodule] = useState(false) 
      const [execTxn, setexecTxn ] = useState(true)
      const [safeInfo, setSafeInfo] = useState({})
    
    
     
         
      
       /*
 const schema = yup.object({
    symbol: yup.string().required(),
    tokenstring: yup.string().required(),
    decimals: yup.string().required(),
    logoUri: yup.string().required(),
    address: yup.string().required(),
  }).required();
 */

  const {
    register,
    handleSubmit,
    watch,
    // Read the formState before render to subscribe the form state through the Proxy
    formState: {  isDirty, isSubmitting, touchedFields, submitCount },
  } = useForm<SwapTokenTransaction>(

    {  defaultValues: 
      {
      amount: 0.0,
      tokentxhash: 'TransactionHash', 
      tokenname: 'Ethereum',
      symbol: 'ETH',
      signer:'0X',
      txdata:'0x'
      },
      resolver: yupResolver(schema)
     
     }  );
     const amountWatch = watch("amount")

    const handleChange = (event) => { 
      isTyping
      setValue(event.target.value)
      !isTyping
      // Logic of token conversion must be here
    
    }
    
    // onchange handling, to post text

    // submission

    const { data } = useQuery(`safe-${walletCheckSumAddress}`, queries.getSafe(walletCheckSumAddress), {
    enabled: !!walletAddress,
    cacheTime: 100,
  })

  const onLoadSafe = async () => Router.push(`safe/${selectedSafe}/transfers`)
  const onCreateSafe = async () => Router.push(`/create`)
  const onLoadSafeOrCreate = async () => Router.push(`/index`)


  const CreateMultisigAlert = () => {
    return (
      <>
        <Button onClick={onOpen}>Setup Multisig  Transaction</Button>
  
        <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Setup Multisig Transaction</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text fontWeight='bold' mb='1rem'>
               To ensure security, you will need to setup your Gnosis Safe security to ensure that transactions take place securely
               Time to setup your safe and setup the transactions as needed
               
               
              </Text>
             
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
              </Button>
              <Button variant='ghost' onClick={()=>{
                setIsLoading(true);
                if (!safeAddress && selectedSafe){
                    
                  <AppAlertDialog
                  isLoading={isLoading}
                  handleSubmit={() =>{ 
                    onConnect()
                    onLoadSafeOrCreate()

                   // getnewsafeAddress(safeAddress)
                   // The loadsafe component will get it (here all we do is to get the safe info but we really want to get all safe instead of the safes)

                   // Building a modal for Loading Safe And Creating Safes
                  setIsLoading(false)}}
                  header="New Safe Needed"
                  body="You will need to setup your gnosis safe address"
                  disclosure={localDisclosure}
                  /// An Onclose Event or function 
                  customOnClose={() => {
                    localDisclosure.onClose()
                    setIsLoading(false)
                    
                  }}
               
                />
               
                   
             }
           else {
                   setIsLoading(true)
                   const safeInfo =  safeService.getSafeInfo(safeAddress)
                         
                   // import componennt
                   // import multisignature wallet info
                   // import multisignature wallet ino
                     
                
               }

              } }>Setup Multisig</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }

 const  onSubmit = async ({ tokentxhash , nonce,amount,tokenname, symbol, logoUri} : SwapTransactionType  ) => {

     
    // We will be executing via a multisig approach here 
    // We will professing sending a swap token which we must 
    // etherjs connecting the swap account
      // Transactional opbject
      // swaptransaction object
       // etherjs stuff
        //Gnosis safe 
      // create transaction
      // propose
      // sign 
      //execute transactiono
      //sign with gnosis safe
      // send transaction
    //  let transactionsend: TransactionResponse = await signer.sendTransaction(swapTransaction);
    //  console.log(transactionsend);
                
      setIsLoading(true)
      onConnect()     
    
      setTransaction(transaction)
      setToken(tokenname)         
   
     
     
      
    /*
      if (!safeAddress && selectedSafe){
             
         getnewsafeAddress(safeAddress)
          
        }
      else {
             setIsLoading(true)
             const safeInfo = await safeService.getSafeInfo(safeAddress)
      }
       if (!isModuleEnabled){
            let {status, safeTxHash, nonce} = await enableSafeModule()
            setexecTxn(true)
            
          }

       checkIsSigned()
    
       if ( !isCurrentUserAlreadySigned && hasReachedThreshold){
        checkIfWaitingForExecution() 
        executeSafeModule()
                 }
          
        approveTransfer({safeTxHash, execTxn, hashTxn})           
           
        rejectTransfer({ safeTxHash, execTxn, nonce })
           
*/

 // approve the transaction to be done
        return {txhash, txdata}
    }
     
      
    const getnewsafeAddress = useCallback(async (safeAddress) => {
       let safeInfo; 
      setIsLoading(true)
      if (safeAddress) {
          safeInfo = await safeService.getSafeInfo(safeAddress)
          setSafeInfo(safeInfo)
      }
      setIsLoading(false)
      return {safeAddress, safeInfo}

    }, [ safeService])


    const manageSelection = () => {
       return (
         <> 
         
      <Button {...buttonProps}>View Transactional Details</Button>
      <Text {...disclosureProps} mt={4}>

      `These are the details of Transaction Here`
      `Amount:   ${amount} string text`
      `Transaction Hash ${tokentxhash} `
      `Token Name:  ${tokenname}`
      `Symbol:  ${symbol} `
      `Signer:  ${signer} `
      
        <br />
        (Details For Transactions To Be Submitted)
      </Text>
         </>

       )


    }

 /*
      let fulltransaction:Transaction =  contract.connect(signer).storeGnosisSafeAddress(String(process.env.DEV_ADDRESS),String(process.env.SAFEADDRESS) );
    
      let receiptdata = await fulltransaction.data;
       console.log(receiptdata) 
      let txhash = fulltransaction.hash;
      
      const tx = await safeService.getTransaction(txhash)

        const GnosisSafeContractFileabi  = "./artifacts/contracts/GnosisSafeGetAddresses.json";
 
     let myabi = JSON.parse(fs.readFileSync('GnosisSafeContractFileabi').toString());


*/


// For multiple the token arrays
const {
 
  control,
  formState: { errors },
  
 
} = useFormContext<TokenType>()



const { fields, remove, append } = useFieldArray({
  
  name: 'tokenlist',
 
})

return (
  <form onSubmit={handleSubmit(()=> {onSubmit({tokentxhash , nonce,amount,tokenname, symbol, logoUri})})}>
  <chakra.form py={2}>
    
   {fields.map((item, index) => {
           const amountError = errors.tokenname[index].amount
          const tokennameError = errors.tokenname[index].tokenname
          const symbolError = errors.tokenname[index].symbol
          const decimalsError = errors.tokenname[index].decimals
          const logoUriError = errors.tokenname[index].decimals
          const isLastIndex = fields.length - 1 === index
      const isLastItem = fields.length - 1 === index

      return (
        <Flex flexDirection="row" py={4} key={item.id}>
         
       
          <FormControl id={`tokenlist.${index}.amount`} w="150px" isInvalid={!!amountError?.message} mx={2}>
            <FormLabel htmlFor="amount">Amount</FormLabel>
            <NumberInput
              {...register("amount" )}
              id={"amount"}
              step={0.01}
              precision={2}
              min={0}
              max={undefined}
              onChange={handleChange}
              isReadOnly={isLoading}
            >
              <NumberInputField name={"amount"} placeholder="0.00" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>{amountError?.message}</FormErrorMessage>
          </FormControl>


          <FormControl w="150px" id={`tokenlist.${index}.tokenname`} isInvalid={!!tokennameError?.message} mx={2}>
            <FormLabel> TokenLists</FormLabel>
            <>     
            <Select {...register("tokenname")} placeholder="Select option" isReadOnly={isLoading} onSelect={ manageSelection} 
             >
               
               
                  {fields.map((item, index) => (
                <option key={item.id} value={`tokenlist.${index}.tokenname`}>
                  {`tokenlist.${index}.symbol`}
                </option>
                   
             
             ))
                        
              }
      </Select>
                   
           <FormErrorMessage>{tokennameError?.message}</FormErrorMessage>
            </>
          </FormControl> 
      
        </Flex>
      )
    })}
      <Stack direction='row' spacing={4}>
       
       <Button
       isLoading
       loadingText={isLoading? 'Reconnecting Metamask' : 'Connected'}  
       colorScheme='teal'
        variant='outline'
        onClick={()=> {              
       return(
         <>
        <AppAlertDialog
         isLoading={isLoading}
         handleSubmit={() =>{ onConnect()
         setIsLoading(false)}}
         header="Connect Metamask"
         body="Press Connect To Retry to Connect To Your Metamask Again"
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
   }
>         
Connect Metamask
</Button>
</Stack>   

<Stack direction='row' spacing={4}>

  <Button
    isLoading
    loadingText='Setting Up Metamask'
    colorScheme='teal'
    variant='outline'
    onSubmit={CreateMultisigAlert}
  >
    Submit
    
  </Button>

</Stack>
  </chakra.form>
  </form>
)
}

export default TokenSwapOriginal

/// show transfer 
/// create transfer button
// On Click we start to create the details for the multitransaction
// Create Transfer -> Modal Asking For Transfer(swaptransfer details) - > on Click -> Create Transfer Page or Modal
// Load Safe And Show Details->  APprove Transfer -> Execute Transfer -> Finallize Swap





