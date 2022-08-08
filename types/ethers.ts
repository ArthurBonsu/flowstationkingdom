import { ExecOptionsWithStringEncoding } from "child_process"
import TXRejectedError from "ganache-core/lib/utils/txrejectederror"
import { Tx } from "web3/eth/types"

export interface Asset {
  symbol: string
  name: string
  decimals: string
  contractAddress: string
  balance?: string
}

export interface Chain {
  name: string
  shortName: string
  chain: string
  network: string
  chainId: number
  networkId: number
  rpc_url: string
  nativeCurrency: Asset
}
export interface  Transactions{

 amount: Number
 tx: string 
 recipient: string 
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






