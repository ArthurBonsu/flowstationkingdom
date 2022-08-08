import { ChakraProvider } from '@chakra-ui/react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { NextPage } from 'next'
import { QueryClientProvider } from 'react-query'
import { FC } from 'react'
import dynamic from 'next/dynamic'

import queryClient from '@config/queryClient'
import { WithPageLayout } from '@components/Layout'
import theme from 'theme'

type NextPageWithLayout = NextPage & WithPageLayout
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const App: FC<AppPropsWithLayout> = ({ Component, pageProps }) => {
  const getLayout = Component.getLayout ?? ((page) => page)
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Head>
          <title>{process.env.appName}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        {getLayout(<Component {...pageProps} />)}
      </QueryClientProvider>
    </ChakraProvider>
  )
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})
