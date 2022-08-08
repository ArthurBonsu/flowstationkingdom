import { Box, Button, Spinner, VStack } from '@chakra-ui/react'
import Router from 'next/router'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { ethers } from 'ethers'

import queries from '@services/queries'
import { getLayout, WithPageLayout } from '@components/Layout'
import { useEthersStore } from '@stores/ethersStore'

import getSafesWithoutModule from '@utils/getSafesWithoutModule'

const Safe: WithPageLayout = () => {
  const walletAddress = useEthersStore((state) => state.address)
  const walletCheckSumAddress = walletAddress ? ethers.utils.getAddress(walletAddress) : ''

  const [selectedSafe, setSelectedSafe] = useState<string>()
  const { data, isLoading } = useQuery(`safe-${walletCheckSumAddress}`, queries.getSafe(walletCheckSumAddress), {
    enabled: !!walletAddress,
    cacheTime: 100,
  })

  const onLoadSafe = async () => Router.push(`safe/${selectedSafe}/transfers`)
  
  const onCreateSafe = async () => Router.push(`/create`)

  return (
    <Box display="flex" alignItems="center" justifyContent="center" minH="calc(100vh - 64px)">
      <VStack spacing={4} minW="md">
        <VStack borderRadius="lg" padding="6" bg="gray.100" minW="md" spacing={4} maxH="70vh" overflow="auto">
          {isLoading ? (
            <Spinner />
          ) : data?.safes.length ? (
            data.safes.map((s) => (
              <Box
                fontSize="lg"
                fontWeight="semibold"
                cursor="pointer"
                borderRadius="lg"
                key={s}
                p="4"
                bg={selectedSafe === s ? 'gray.300' : 'gray.200'}
                _hover={{ bg: 'gray.300' }}
                onClick={() => setSelectedSafe(s)}
              >
                {s}
              </Box>
            ))
          ) : (
            <Box>No safes found under your wallet</Box>
          )}
        </VStack>
        <Button colorScheme="green" isFullWidth onClick={onLoadSafe} disabled={!selectedSafe}>
          Load Safe
        </Button>
        <Button colorScheme="blue" isFullWidth onClick={onCreateSafe}>
          Create Safe
        </Button>
        <Button colorScheme="gray" isFullWidth onClick={getSafesWithoutModule}>
          Disabled Module Safe List
        </Button>
      </VStack>
    </Box>
  )
}

Safe.getLayout = getLayout('Safes')
export default Safe
