require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */

const GANACHE_RPC_URL = process.env.GANACHE_RPC_URL;
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const GANACHE_PRIVATE_KEY = process.env.GANACHE_PRIVATE_KEY;
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;

const developmentChains = ["hardhat", "ganache", "localhost"];
const DECIMALS = 8;
const INITIAL_ANSWER = 200000000000;

module.exports = {
	solidity: "0.8.8",
	defaultNetwork: "hardhat",
	networks: {
		ganache: {
			url: GANACHE_RPC_URL,
			accounts: [GANACHE_PRIVATE_KEY],
			chainId: 1337,
		},
		goerli: {
			url: GOERLI_RPC_URL,
			accounts: [GOERLI_PRIVATE_KEY],
			chainId: 5,
			blockConfirmations: 6,
		},
	},
	etherscan: {
		apiKey: ETHERSCAN_API_KEY,
	},
	gasReporter: {
		enabled: true,
		outputFile: "gas-report.txt",
		noColors: true,
		currency: "USD",
		coinmarketcap: COINMARKETCAP_API_KEY,
		token: "MATIC",
	},
	namedAccounts: {
		deployer: {
			default: 0,
			// goerli: GOERLI_PRIVATE_KEY, ?? no
			// 1337: 3
		},
		user: {
			default: 1,
		},
	},
};
