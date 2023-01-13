const { assert } = require("chai");
const { ethers, getNamedAccounts, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
	? describe.skip
	: describe("FundMe", async function () {
			let fundMe;
			let deployer;
			const sendValue = ethers.utils.parseEther("0.001"); // 1 ETH
			beforeEach(async function () {
				// deploy FundMe contract with hh deploy
				deployer = (await getNamedAccounts()).deployer;
				fundMe = await ethers.getContract("FundMe", deployer); // return most recent FundMe contract
			});

			it("allows people to fund and withdraw", async function () {
				await fundMe.fund({ value: sendValue });
				await fundMe.witdraw();
				const endingBalance = await fundMe.provider.getBalance(
					fundMe.address
				);
				assert.equal(endingBalance.toString(), "0");
			});
	  });
