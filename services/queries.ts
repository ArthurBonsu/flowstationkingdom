import axios from 'axios'
// The json api info is designed as types here
import { TransfersType, AssetType, SafeInfoType, SwapTransactionType,TokenInfoResponse } from 'types'
import { useHashTransactionStore } from '@stores/transactionStore'
/**
 * Should only register GET requests
 */
// getting safes owned by the wallet 
const logouri = useHashTransactionStore((state) => state.txlogoUri)
export default {
  getSafe: (walletAddress: string | null) => async () => {
    const result = await axios.get<{ safes: Array<string> }>(
      `https://safe-transaction.rinkeby.gnosis.io/api/v1/owners/${walletAddress}/safes/`
    )
    // returning the results and data 
    return result.data
  },

  /// get safetransfers 
  getSafeTransfers: (safeAddress: string) => async () => {
    const result = await axios.get<TransfersType>(
      `https://safe-transaction.rinkeby.gnosis.io/api/v1/safes/${safeAddress}/multisig-transactions/`
    )
    return result.data
  },

  /// get assets 
  getAssets: (safeAddress: string) => async () => {
    const result = await axios.get<Array<AssetType>>(
      `https://safe-transaction.rinkeby.gnosis.io/api/v1/safes/${safeAddress}/balances/usd/`
    )
    return result.data
  },
  // This is an api call which takes the api parameters in 
  getSafeInfo: (safeAddress: string) => async () => {
    const result = await axios.get<SafeInfoType>(
      `https://safe-transaction.rinkeby.gnosis.io/api/v1/safes/${safeAddress}/`
    )
    return result.data
  },

  getSwapTransactionInfo: () => async () => {

    const result = await axios.get<SwapTransactionType>(
    
      // Logo Uri swa
      `https://safe-transaction.rinkeby.gnosis.io/api/v1//tokens​/${logouri}​/`
    )
    return result.data
  },

  getTokenTransactionInfo: (address: string ) => async () => {

    const result = await axios.get<TokenInfoResponse>(
    
      // Logo Uri swap
      `https://safe-transaction.rinkeby.gnosis.io/api/v1//tokens​/${address}​/`
    )
    return result.data
  },
}
