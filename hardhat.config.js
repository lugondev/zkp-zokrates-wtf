require('hardhat-log-remover');
require('@nomiclabs/hardhat-waffle');
require("@nomiclabs/hardhat-etherscan")
const INFURA_API_KEY = process.env.INFURA_API_KEY || ''
// const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
// const ETHERSCAN_API_KEY = "1CS5D1BZ7FPHRR55PGWIZXKV339R75IF9P"
const ETHERSCAN_API_KEY = "VWBJWBRU3DJR2ZAVDZUVDTUPYQTMQMYZ6N" // mumbai

const accounts = [
  "3c35971975bc77bf7bdb29f2af493a8a5e5fbb6d10c2cb44aba491ad31665316"
]

const config = {
  defaultNetwork: 'hardhat',
  solidity: {
    compilers: [
      { version: '0.8.0', settings: {} },
      { version: '0.8.3', settings: {} },
      { version: '0.8.4', settings: {} },
      { version: '0.8.9', settings: {} },
      { version: '0.8.7', settings: {} }
    ]
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true
    },
    localhost: {},
    bsc: {
      url: `https://bsc-dataseed.binance.org/`,
      accounts: accounts
    },
    mumbai: {
      url: `https://rpc-mumbai.maticvigil.com/`,
      accounts: accounts
    },
    bscTestnet: {
      url: `https://rpc.ankr.com/bsc_testnet_chapel`,
      accounts: accounts
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
      accounts: accounts
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
      accounts: accounts
    },
    coverage: {
      url: 'http://127.0.0.1:8545' // Coverage launches its own ganache-cli client
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: ETHERSCAN_API_KEY
  },
  mocha: {
    timeout: 200000
  },
  paths: {
    tests: "./test"
  }
}

module.exports = config
