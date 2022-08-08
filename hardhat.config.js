let  { config } =require  ("process");

let  { HardhatUserConfig } =require ("hardhat/types");
let  accounts= require ("./Accounts");

let dotenv =require('dotenv'); 

let ethers = require ("@nomiclabs/hardhat-ethers");

let soliditycoverage = require("solidity-coverage");
let hardhatgasreporter = require("hardhat-gas-reporter");
let hardhatdeploy = require("hardhat-deploy");
let hardhat = require("@typechain/hardhat");
let hardhatetherscan = require("@nomiclabs/hardhat-etherscan");
let hardhatwaffle = require ("@nomiclabs/hardhat-waffle");

let hardhattruffle = require("@nomiclabs/hardhat-truffle5");
let hardhatupgrade = require('@openzeppelin/hardhat-upgrades');

dotenv.config()


const MNEMONIC = process.env.MNEMONIC

module.exports = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [
      {
        version: "0.8.2",
        settings: {
          optimizer: {
            enabled: false
          }
        },
      },
      {
        version: "0.5.5",
      },
      {
        version: "^0.8.0",
      },
      {
        version: "0.8.0",
      },
      {
        version: "^0.6.0",
      },
       {
        version: "0.6.0",
      },
      
     
       {
        version: "^0.4.11",
      },
       {
        version: "0.4.11",
      },
       {
        version: "^0.4.24",
      },
      
       {
        version: "0.4.24",
      },
      {
        version: "^0.5.0",
      },
      {
        version: "^0.6.6",
      },
      {
        version: ">=0.7.0 <0.8.0",
      },
       {
        version: ">=0.6.0 <0.8.0",
      },
    ],
  
    overrides: {
      "contracts/Color.sol": {
        version: "0.8.2",
        settings: { optimizer: {
          //evmVersion: "constantinople", consensus algorithm to change
          enabled: false
        },
      }
    },
  
  }
  },

 
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts",
    tests: "./test",
    cache: "./cache",
    deploy: "./deploy",
    
  },

 // mocha: {
   //timeout:80000 
    //}
    networks: {
    hardhat: {
     
      accounts: accounts,
       gas: "auto",
      gasPrice: "auto",
      gasMultiplier: 1.5,
      chainId:1337
    },
    polygon: {
      url: "https://rpc-mainnet.maticvigil.com/",
      // accounts: [`${process.env.RINKEBY_MNEUMONIC}`],
        accounts:[`0x${process.env.PRIVATE_KEY}`],
     
  },
  

    coverage: {
      url: 'http://127.0.0.1:5458'
    },
    localhost: {
      url: 'http://127.0.0.1:8545',
     
     gas: "auto",
      gasPrice:"auto",
      gasMultiplier: 1.5
    },

    arbitrum: {
      url: process.env.L2_RPC, 
      accounts:[`0x${process.env.PRIVATE_KEY}`],
      chainId: 421611,
       gas: "auto",
      gasPrice:"auto",
      gasMultiplier: 1.5
    },
     goerli: {
      url: `https://goerli.infura.io/v3/${process.env.GOELI_API_KEY}`,
        accounts:[`0x${process.env.PRIVATE_KEY}`],
      chainId: 5,
     
      gas: "auto",
      gasPrice: "auto",
      gasMultiplier: 1.5
    },
    rinkeby: {
     
     
       chainId: 4,
      url:`https://rinkeby.infura.io/v3/${process.env.RINKEBY_API_KEY}`,
   
      accounts:[`0x${process.env.PRIVATE_KEY}`],
      // gas: 3000000,1000000000
       gas: "auto",
      gasPrice: "auto",
      gasMultiplier: 1.5
  },
 
  ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.ROPSTEN_KEY}`,
       chainId: 3,
       accounts:[`0x${process.env.PRIVATE_KEY}`],
     // url: String(process.env.ROPSTEN_RPC_URL),
    
    //  url: `https://rinkeby.infura.io/v3/`,
     
     /* accounts: {
         privatekey:   [RU], 
        mnemonic: `${process.env.RINKEBY_MNEUMONIC}`
    },*/
     //  accounts: [`0x${process.env.PRIVATE_KEY}`],
    // accounts: {
      //  mnemonic: `${process.env.MNEUMONIC}`
     // },
      // gas: 3000000,1000000000
       gas: "auto",
      gasPrice: "auto",
      gasMultiplier: 1.5
  },

 
  kovan: {
   
       chainId: 42,
      url: `https://kovan.infura.io/v3/${process.env.KOVAN_API_KEY}`,
    //  url: `https://rinkeby.infura.io/v3/`,
     
     /* accounts: {
         privatekey:   [RU], 
        mnemonic: `${process.env.RINKEBY_MNEUMONIC}`
    },*/
     //  accounts: [`0x${process.env.PRIVATE_KEY}`],
      accounts:[`0x${process.env.PRIVATE_KEY}`],
  
      // gas: 3000000,1000000000
       gas: "auto",
      gasPrice: "auto",
      gasMultiplier: 1.5
  },
  
    mainnet: {
   
       chainId: 1,
      url: `https://mainnet.infura.io/v3/${process.env.MAINNET_API_KEY}`,
     
       accounts:[`0x${process.env.PRIVATE_KEY}`],
    }
  },
  
  
  gasReporter: {
  //  coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    enabled: !!(process.env.REPORT_GAS && process.env.REPORT_GAS != "false"),
  },
 
  typechain: {
    outDir: "typechain",
    target: "ethers-v5"
  },
  namedAccounts: {
    deployer: {
      default: 0,
      6: 0,
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
      4: String(process.env.DEV_ADDRESS), // but for rinkeby it will be a specific address
      "goerli": String(process.env.DEV_ADDRESS),
       //it can also specify a specific netwotk name (specified in hardhat.config.js)
    },
    tokenowner: String (process.env.DEV_ADDRESS)
  },
  
   etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_API_KEY
  }
}
