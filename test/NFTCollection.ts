import {expect} from "chai";
import hre, {ethers, web3} from "hardhat";

function generateAccounts(count: number): string[] {
  const accounts = [];
  for (let i = 0; i < count; i++) {
    accounts.push(web3.eth.accounts.create().address);
  }
  return accounts;
}

describe("NFTCollection", function () {

    describe("BaseURI", function () {
  
      it("Should check setBaseURI method", async function () {
        const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
        const nftCollection = await NFTCollection.deploy();
  
        await nftCollection.setBaseURI("http://api2.nftCollection.example.com/");
        expect(await nftCollection.baseURI()).to.equal("http://api2.nftCollection.example.com/");
      });
    });
  
}