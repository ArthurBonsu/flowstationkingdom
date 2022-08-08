import {
  Alert,
  AlertIcon,
  Box,
  Button,
  ButtonGroup,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Flex,
} from '@chakra-ui/react';

//import { ethers as normalethers} from "ethers"

// the transfer is exected here 
const hre = require ("hardhat");

import ApproveTransfer from '@components/ApproveTransfer'
import ExecuteTransfer from '@components/ExecuteTransfer'
import { getLayout, WithPageLayout } from '@components/Layout'
import PageSelection from '@components/PageSelection'
import RejectTransfer from '@components/RejectTransfer'
import queries from '@services/queries'
import { dateAtTime } from '@utils/formatDate'
import { format, Response, Return } from '@utils/formatTransfersTable'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { ErrorType } from 'types'
import { useSafeStore, Safe } from '@stores/safeStore'
import { useSafe } from '@hooks/useSafe'
import { useEthersStore } from '@stores/ethersStore'


const MODULE_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string

const Transfers: WithPageLayout = () => {
  const { query } = useRouter()
  const safeAddress = typeof query.safeAddress === 'string' ? query.safeAddress : ''
  const address = useEthersStore((state) => state.address)
  // so  this is how data was returned
  const [cleanedData, setCleanedData] = useState<Return[] | null>(null)

  const { setIsModuleEnabled: setIsModuleEnabledInternal, isModuleEnabled: isModuleEnabledInternal } = useSafeStore(
    ({ setIsModuleEnabled, isModuleEnabled }: Safe) => ({ setIsModuleEnabled, isModuleEnabled })
  )

  /* isLoading: isEnableSafeModuleLoading,
  enableSafeModule,
  safe
  isCurrentUserAlreadySIgned
  refetch
  hasReached
  
  */

  //isLoading:isEnableSafeModule
  const {
    isLoading: isEnableSafeModuleLoading,
    enableSafeModule,
    safe,
    isCurrentUserAlreadySigned,
    refetch,
    hasReachedThreshold,
    executeSafeModule,
  } = useSafe({ safeAddress, userAddress: address })


/* 
const {data, isLoading,IsError, error} = useQuery( `${safeAddress}-transfer2`,
queries.getSafeTransfers(safeAddress){
queries.getSafeTransfers(safeADdress), {
  cacheTime: 0,
  enabled: !!safe && !!safeAddress,

  retry:2,
  onError: (err:ErrorType) => {
    return err
  },
  onSuccess:async  (response:Response) =>{
    const formattedData = format (response, address, safe?.threshold)
  }
},

})
*/
// getting the query, there is a query on the safe just to approve 

  const { data, isLoading, isError, error } = useQuery(
    `${safeAddress}-transfers`,
    queries.getSafeTransfers(safeAddress),
    {
      cacheTime: 0,
      enabled: !!safe && !!safeAddress,
      retry: 2,
      onError: (err: ErrorType) => {
        return err
      },
      onSuccess: async (response: Response) => {
        const formattedData = format(response, address, safe?.threshold)
        setIsModuleEnabledInternal(safe?.modules.includes(MODULE_ADDRESS) || false)
        setCleanedData(formattedData)
      },
    }
  )
// check for the safe loss 
  const onEnableSafeModule = async () => {
    const { status } = await enableSafeModule()
    await refetch[status]()
  }

  const onExecuteSafeModule = async () => {
    const { status } = await executeSafeModule()
    await refetch[status]()
  }

  if (isError) {
    return <span>Error: {error?.message}</span>
  }

   // looping the values and using the details, 
   // passing the details of the queries into the various components for execution
  return !data || isLoading ? (
    <Box minH="calc(100vh - 64px)" d="flex" alignItems="center" justifyContent="center">
      <Spinner />
    </Box>
  ) : (
    <Box py={6}>
      <PageSelection value="transfers" />
      {Boolean(!isModuleEnabledInternal) && (
        <Alert status="warning" mb="10px">
          <Flex justifyContent="space-between" alignItems="center" w="full">
            <Flex>
              <AlertIcon />
              <Text>The Flowstation module is not yet enabled on this safe.</Text>
            </Flex>
            <Box>
              <Button
                bg="white"
                mr="10px"
                disabled={isCurrentUserAlreadySigned}
                isLoading={isEnableSafeModuleLoading}
                onClick={onEnableSafeModule}
              >
                Enable Module
              </Button>
              {Boolean(hasReachedThreshold) && (
                <Button
                  bg="blue.300"
                  textColor="white"
                  _hover={{
                    background: 'blue.200',
                  }}
                  isLoading={isEnableSafeModuleLoading}
                  // Execute safe model
                  onClick={onExecuteSafeModule}
                >
                  Execute
                </Button>
              )}
            </Box>
          </Flex>
        </Alert>
      )}
      <Table>
        <Thead bg="gray.100">
          <Tr>
            <Th>Nonce</Th>
            <Th>Timestamp</Th>
            <Th>Status</Th>
            <Th>Approvals</Th>
            <Th>Rejections</Th>
            <Th>Action</Th>
            <Th>TxHash</Th>
          </Tr>
        </Thead>
        
        <Tbody>
          {!isLoading &&
            cleanedData?.map((t, key) => {
              if (t.isEnableModule) return null
              return (
                <Tr key={key}>
                  <Td>{t.nonce}</Td>
                  <Td>{dateAtTime(t.timestamp)}</Td>
                  <Td textTransform="uppercase">{t.status}</Td>
                  <Td>
                    {t.approvals} / {t.threshold}
                  </Td>
                  <Td>
                    {t.rejections} / {t.threshold}
                  </Td>
                  <Td>
                    {Boolean(t.action.show) && (
                      <ButtonGroup variant="outline" spacing="2">
                        {t.isNextTxn && (
                          <ExecuteTransfer
                            colorScheme="blue"
                            variant="solid"
                            isDisabled={!(t.approvals === Number(t.threshold) || t.rejections === Number(t.threshold))}
                            safeTxHash={t.transactionHash}
                            safeRejectTxHash={t.rejectionTransactionHash}
                            threshold={t.threshold}
                            nonce={t.nonce}
                            
                          />
                        )}
                        <ApproveTransfer
                          hashTxn={t.hashTxn}
                          safeTxHash={t.transactionHash}
                          isDisabled={!t.action.approve}
                          colorScheme="blue"
                          threshold={Number(t.threshold)}
                          execTxn={t.approvals === Number(t.threshold) - 1 && t.isNextTxn}
                        />
                        <RejectTransfer
                          safeTxHash={t.rejectionTransactionHash}
                          isDisabled={!t.action.reject}
                          threshold={Number(t.threshold)}
                          execTxn={t.rejections === Number(t.threshold) - 1 && t.isNextTxn}
                          nonce={t.nonce}
                        />
                      </ButtonGroup>
                    )}
                  </Td>
                </Tr>
              )
            })}
        </Tbody>
      </Table>
    </Box>
  )
}

Transfers.getLayout = getLayout('Transfers')
export default Transfers
