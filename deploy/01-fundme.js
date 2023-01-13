// function deployFunc() {
// 	console.log("hi");
// }
// module.exports.default = deployFunc;

const { network } = require("hardhat");
const hardhatConfig = require("../hardhat.config");
const {
	networkConfig,
	developmentChains,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
	const { deploy, log } = deployments;
	const { deployer } = await getNamedAccounts();
	const chainId = network.config.chainId;

	// we can make connection between chainId and Agregator address!!!``
	// const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
	// if contrac doesn't exist, we deploy a minimal version on it to our local testing system
	// when going for localhost or hh network we want to use a mock
	let ethUsdPriceFeedAddress;
	if (developmentChains.includes(network.name)) {
		const ethUsdAggregator = await deployments.get("MockV3Aggregator");
		ethUsdPriceFeedAddress = ethUsdAggregator.address;
	} else {
		ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
	}

	const args = [ethUsdPriceFeedAddress];
	log(ethUsdPriceFeedAddress);
	const fundMe = await deploy("FundMe", {
		from: deployer,
		args: args, // we should put price feed address agregator for current network
		log: true,
		waitConfirmations: network.config.blockConfirmations || 1,
	});

	if (
		!developmentChains.includes(network.name) &&
		process.env.ETHERSCAN_API_KEY
	) {
		// we need to wait some blocks => realization in hardhat.config.js
		await verify(fundMe.address, args);
	}
	log("---------------------------");
};
module.exports.tags = ["all", "fundme"];
