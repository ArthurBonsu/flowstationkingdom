import { Box, Spinner, Table, Thead, Th, Tbody, Tr, Td } from '@chakra-ui/react'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'

import PageSelection from '@components/PageSelection'
import { getLayout, WithPageLayout } from '@components/Layout'
import queries from '@services/queries'
import { limitDecimals } from '@utils/tokenUtils'
import { ErrorType } from 'types'

const Assets: WithPageLayout = () => {
  const { query } = useRouter()
  const safeAddress = typeof query.safeAddress === 'string' ? query.safeAddress : ''
  const { data, isLoading, isError, error } = useQuery(`${safeAddress}-assets`, queries.getAssets(safeAddress), {
    enabled: !!safeAddress,
    retry: 2,
    onError: (err: ErrorType) => {
      return err
    },
  })

  if (isError) {
    return <span>Error: {error?.message}</span>
  }

  return isLoading ? (
    <Box minH="calc(100vh - 64px)" d="flex" alignItems="center" justifyContent="center">
      <Spinner />
    </Box>
  ) : (
    <Box py={6}>
      <PageSelection value="assets" />
      <Table>
        <Thead bg="gray.100">
          <Tr>
            <Th>Asset</Th>
            <Th isNumeric>Balance</Th>
            <Th isNumeric>Balance (USD)</Th>
          </Tr>
        </Thead>
        <Tbody>
          {(data || []).map((t) => {
            const token =
              t.token && t.tokenAddress
                ? {
                    ...t.token,
                    tokenAddress: t.tokenAddress,
                  }
                : {
                    name: 'Ethereum',
                    symbol: 'ETH',
                    decimals: 18,
                    logoUri: '',
                    tokenAddress: '',
                  }
            const tokenBalance = Math.pow(10, -token.decimals) * t.balance
            return (
              <Tr key={t.timestamp}>
                <Td>
                  {token.name} ({token.symbol})
                </Td>
                <Td isNumeric>{limitDecimals(tokenBalance)}</Td>
                <Td isNumeric>$ {Number(t.fiatBalance).toLocaleString()}</Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </Box>
  )
}

Assets.getLayout = getLayout('Assets')
export default Assets
