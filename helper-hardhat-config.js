const networkConfig = {
	5: {
		name: "goerli",
		ethUsdPriceFeed: "0xd4a33860578de61dbabdc8bfdb98fd742fa7028e", // https://docs.chain.link/data-feeds/price-feeds/addresses
	},
	137: {
		name: "polygon",
		ethUsdPriceFeed: "0x0715a7794a1dc8e42615f059dd6e406a6594651a", // https://docs.chain.link/data-feeds/price-feeds/addresses?network=polygon
	},
};

const developmentChains = ["hardhat", "localhost", "ganache"];
const DECIMALS = 8;
const INITAL_ANSWER = 200000000000;

module.exports = {
	networkConfig,
	developmentChains,
	DECIMALS,
	INITAL_ANSWER,
};
