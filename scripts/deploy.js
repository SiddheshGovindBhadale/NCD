const hre = require("hardhat");
// async function getBalances(address) {
//   const balanceBigInt = await hre.ethers.provider.getBalance(address);
//   return hre.ethers.utils.formatEther(balanceBigInt);
// }

// async function cosoleBalances(addresses) {
//   let counter = 0;
//   for (const address of addresses) {
//     console.log(`Address ${counter} balance:`, await getBalances(address));
//     counter++;
//   }
// }
async function consoleMemos(memos) {
  for (const memo of memos) {
    const NCD_ID = memo.NCD_ID;
    const DocType_ID = memo.DocType_ID;
    const user_ID = memo.user_ID;
    const data = memo.data;
    const history = memo.history;
    console.log(
      `NCD_ID ${NCD_ID},DocType_ID ${DocType_ID},user_ID ${user_ID},data ${data},history ${history}`
    );
  }
}
async function main() {
  const [owner, from1, from2, from3] = await hre.ethers.getSigners();
  const doc = await hre.ethers.getContractFactory("doc");
  const contract = await doc.deploy(); //instance of contract

  await contract.deployed();
  console.log("Address of contract:", contract.address);

  const addresses = [
    owner.address,
    from1.address,
    from2.address,
    from3.address,
  ];
  // console.log("Before buying chai");
  // await cosoleBalances(addresses);

  const amount = { value: hre.ethers.utils.parseEther("1") };
  await contract.connect(from1).addDocs("1", "1", "1", ["test1","test1"],[]);
  await contract.connect(from2).addDocs("2", "2", "2", ["test2","test2"],[]);
  await contract.connect(from3).addDocs("3", "3", "3", ["test3","test3"],[]);
  await contract.connect(from2).addHistoryArray("2", ["Htest3","Htest3"]);
  await contract.connect(from1).addHistoryArray("1", ["Htest31","Htest31"]);

  // console.log("After buying chai");
  // await cosoleBalances(addresses);

  const memos = await contract.getDocs();
  consoleMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
