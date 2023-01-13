const { ethers, getNamedAccounts } = require("hardhat");

async function main() {
	const { deployer } = await getNamedAccounts();
	const fundMe = await ethers.getContract("FundMe", deployer);
	console.log("Funding contract...");
	const transactionResponse = await fundMe.withdraw();
	await transactionResponse.wait(1);
	console.log("Withdrawed!");
	console.log(deployer);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.log(error);
		process.exit(0);
	});
