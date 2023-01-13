const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
	? describe.skip
	: describe("FundMe", async function () {
			let fundMe;
			let deployer;
			let mockV3Aggregator;
			const sendValue = ethers.utils.parseEther("1"); // 1 ETH
			beforeEach(async function () {
				// deploy FundMe contract with hh deploy
				deployer = (await getNamedAccounts()).deployer;
				await deployments.fixture(["all"]); // deploy our contracts with tags
				fundMe = await ethers.getContract("FundMe", deployer); // return most recent FundMe contract
				mockV3Aggregator = await ethers.getContract(
					"MockV3Aggregator",
					deployer
				);
			});

			describe("constructor", async function () {
				it("sets the aggregator addresses correctly", async function () {
					const response = await fundMe.priceFeed();
					assert.equal(response, mockV3Aggregator.address);
				});
			});

			describe("fund", async function () {
				it("Fails if u don't send enought eth", async function () {
					await expect(fundMe.fund()).to.be.revertedWith(
						"You need to spend more ETH!"
					);
				});
				it("Correctly addressToAmountFunded updation", async function () {
					await fundMe.fund({ value: sendValue });
					const response = await fundMe.addressToAmountFunded(
						deployer
					);
					assert.equal(response.toString(), sendValue.toString());
				});
				if (
					("Adding funders",
					async function () {
						await fundMe.fund({ value: sendValue });
						const funder = await fundMe.funders(0);
						assert.equal(funder, deployer);
					})
				);
			});

			describe("withdraw", async function () {
				beforeEach(async function () {
					await fundMe.fund({ value: sendValue });
				});

				it("withdraw ETH from a single founder", async function () {
					// Arrange
					const startingFundMeBalance =
						await fundMe.provider.getBalance(fundMe.address);
					const startingDeployerBalance =
						await fundMe.provider.getBalance(deployer);

					// Act
					const transactionResponse = await fundMe.withdraw();
					const transactionReceipt = await transactionResponse.wait(
						1
					);
					const { gasUsed, effectiveGasPrice } = transactionReceipt;
					const gasCost = gasUsed.mul(effectiveGasPrice);

					const endingFundMeBalance =
						await fundMe.provider.getBalance(fundMe.address);
					const endingDeployerBalance =
						await fundMe.provider.getBalance(deployer);

					// Assert
					assert.equal(endingFundMeBalance, 0);
					assert.equal(
						endingDeployerBalance.add(gasCost).toString(),
						startingFundMeBalance
							.add(startingDeployerBalance)
							.toString()
					);
				});

				it("withdraw ETH from a multiple founders", async function () {
					// Arrange
					const accounts = await ethers.getSigners();
					// console.log(accounts.length) // 20
					// 0 index is a deployer
					for (let i = 1; i < 6; i++) {
						const fundMeConnectedContract = await fundMe.connect(
							accounts[i]
						);
						fundMeConnectedContract.fund({ value: sendValue });
					}
					const startingFundMeBalance =
						await fundMe.provider.getBalance(fundMe.address);
					const startingDeployerBalance =
						await fundMe.provider.getBalance(deployer);

					// Act
					const transactionResponse = await fundMe.withdraw();
					const transactionReceipt = await transactionResponse.wait(
						1
					);
					const { gasUsed, effectiveGasPrice } = transactionReceipt;
					const gasCost = gasUsed.mul(effectiveGasPrice);

					const endingFundMeBalance =
						await fundMe.provider.getBalance(fundMe.address);
					const endingDeployerBalance =
						await fundMe.provider.getBalance(deployer);

					// Assert
					assert.equal(endingFundMeBalance, 0);
					// assert.equal(
					// 	endingDeployerBalance.add(gasCost).toString(),
					// 	startingFundMeBalance.add(startingDeployerBalance).toString()
					// );

					// also check that funders are reset properly
					await expect(fundMe.funders(0)).to.be.reverted;

					for (let i = 1; i < 6; i++) {
						assert.equal(
							0,
							await fundMe.addressToAmountFunded(
								accounts[i].address
							)
						);
					}
				});

				it("owner modifier", async function () {
					const accounts = await ethers.getSigners(); // not a deployer
					const attacker = accounts[1];
					const attackerConnectedContract = await fundMe.connect(
						attacker
					);
					await expect(attackerConnectedContract.withdraw()).to.be
						.reverted;
				});
			});
	  });
