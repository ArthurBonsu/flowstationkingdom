import { ethers } from 'ethers'
const hre = require ("hardhat")
import EthersAdapter  from '@gnosis.pm/safe-ethers-lib'


import Safe, { SafeFactory, SafeAccountConfig,EthSignSignature, SafeFactoryConfig } from '@gnosis.pm/safe-core-sdk';
 import { Signer, BigNumber, ContractFactory, Contract } from "ethers";
import { JsonRpcProvider } from '@ethersproject/providers';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import { ContractNetworksConfig } from '@gnosis.pm/safe-core-sdk'


// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any

let newSafeAddress:string; 
let owneraddress:string;
let signedowners: Signer[];
let DeployedContractAddress:string; 
let  ethAdapterOwner1;let owners:string[];
let ownersigner:string;

let givensigner:Signer;
let ethAdapter; 


// Do we need to self generate the addressess here 
// Do we need to genreate the safe addresses or they automatically do that 

export const createSafe = async (   threshold:number , extrauseraddreess?: string[]) => {
  const web3Provider = window.ethereum
  const provider = new ethers.providers.Web3Provider(web3Provider)
  //Set signers as string , this seems to take the list of accounts on metamasks
  owners = await provider.listAccounts()

  const user = extrauseraddreess
  .map((user, index) => owners.push(user)); 
            
  // owner1 = provider.getSigner(0)
  ownersigner = owners[0];
  // For signer (Signer)
  givensigner = hre.ethers.getSigners(0)
 
  
  ethAdapter = new EthersAdapter({
    ethers,
    signer: givensigner
  })

// ethAdapter
   //(method) SafeFactory.create({ ethAdapter, safeVersion, isL1SafeMasterCopy, contractNetworks }: 
                                                      // isL1SafeMasterCopy : true
  const safeFactory:SafeFactory = await SafeFactory.create({ ethAdapter  })

  const safeAccountConfig: SafeAccountConfig = {owners, threshold  }
  const safeSdk: Safe = await safeFactory.deploySafe({ safeAccountConfig })

  /// This is how you get the address of the safe addresses
   newSafeAddress = safeSdk.getAddress()

   alert(`New safe has been created ${newSafeAddress}`)
  
/*
    let GnosisSafeContractInstance:ContractFactory  = await hre.ethers.getContractFactory("GnosisSafeGetAddresses");
    let GnosisSafeContractActual:Contract  = await GnosisSafeContractInstance.deploy();

    let GnosisContractAddress:string = await GnosisSafeContractActual.address;
    let GnosisSafeContractInstanceSigned = await  GnosisSafeContractActual.connect(givensigner);

  let safeStoreTx =  await  GnosisSafeContractActual.storeGnosisSafeAddress( givensigner, newSafeAddress);
  let safeStoreTxhash =  safeStoreTx.hash;

  const safeTransaction = await safeSdk. createTransaction(safeStoreTxhash);
*/
    
  return {
    ethAdapter,
    safeFactory,
    owners,
    safeAccountConfig,
    safeSdk,
    newSafeAddress,
    threshold
  }

}
    
export default createSafe
