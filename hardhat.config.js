require("@nomiclabs/hardhat-waffle")
const fs = require("fs")
const privateKey = fs.readFileSync(".secret").toString()
const projectId = "fc66d222860b9580c47e60a7a3a800d4b420dfd2"

module.exports = {
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337
    }
  /*  mumbai: {
      url: `https://rpc-mumbai.maticvigil.com/v1/${projectId}`,
      accounts: [privateKey]
    },
    mainnet: {
      url: `https://rpc-mainnet.maticvigil.com/v1/${projectId}`,
      accounts: [privateKey]
    }*/
  },
  solidity: "0.8.4"
};
