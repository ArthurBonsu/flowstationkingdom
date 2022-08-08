import { FC, useEffect } from 'react'
import { Button, Grid } from '@chakra-ui/react'
import useEthers from '@hooks/useEthers'
import { useRouter } from 'next/router'
import { useEthersStore } from '@stores/ethersStore'

export const Auth: FC = () => {
  const { onConnect } = useEthers()
  const { push } = useRouter()
  const address = useEthersStore((state) => state.address)

  useEffect(() => {
    if (address) {
      push('/safe')
    }
  }, [address, push])

  return (
    <Grid placeItems="center" h="100vh">
      <Button onClick={onConnect}>Connect</Button>
    </Grid>
  )
}

export default Auth
