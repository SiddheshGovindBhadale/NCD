const hre = require("hardhat");

async function main() {
  const doc = await hre.ethers.getContractFactory("doc");
  const contract = await doc.deploy(); //instance of contract

  await contract.deployed();
  console.log("Address of contract:", contract.address);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
