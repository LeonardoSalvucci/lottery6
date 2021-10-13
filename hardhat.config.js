require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy")
const privKey = '137bfdb5952ca421d407e791a050faa877b9c6408e77ef44b20f5e2998884a72';
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.7",
        settings: {
          optimizer: {
            enabled: false,
            runs: 200,
          },
        },
      },
      {
        version: "0.4.24"
      },
      {
        version: "0.6.6"
      }
    ]
  },
  networks: {
    hardhat: {
      /*forking: {
        url: "https://data-seed-prebsc-1-s1.binance.org:8545",
        chainId: 97
      }*/
    },
    bsc_testnet: {
      url: `https://data-seed-prebsc-1-s1.binance.org:8545`,
      accounts: [`0x${privKey}`]
    },
  },
  etherscan: {
    apiKey: 'QH4GTKRG2QDKBB3FT9PKANNR18PYZY8A4T'
  },
  namedAccounts: {
    deployer: {
        default: 0, // here this will by default take the first account as deployer
        1: 0 // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
    feeCollector: {
        default: 1
    }
},
};
