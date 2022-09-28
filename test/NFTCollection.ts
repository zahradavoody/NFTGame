import {expect} from "chai";
import hre, {ethers, web3} from "hardhat";
const { default: Web3 } = require('web3');

 
describe("NFTCollection", function () {

  const founderAddress1 ="0xcFB0cF666A765669758905D876f16C963312Cea2";
  const founderAddress2 ="0xd94ae54c9f302C899056eA88d9E278c1c2B85Fbe";
  const founderAddress3 ="0xACE4e59882A10440167f673CB9b8Cc83C8984D36";
  
  const rewardAccount ="0xe89000B354F87DAba523A4142d648520a1A0Ab2c";
  
    describe("BaseURI", function () {
      
      
      xit("Should check setBaseURI method", async function () {
        const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
        const nftCollection = await NFTCollection.deploy();
        await nftCollection.setBaseURI("http://api2.nftCollection.example.com/");
       expect(await nftCollection.baseURI()).to.equal("http://api2.nftCollection.example.com/");
      });
    });

    describe("mint", function () {
  
      xit("Should reject if mintAmount = 0 ", async function () {
        const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
        const nftCollection = await NFTCollection.deploy();
  
       await expect(nftCollection.mint(0)).to.be.revertedWith("NFTCollection: Invalid mint amount!");
      });

      xit("Should reject if mintAmount = 2 ", async function () {
        const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
        const nftCollection = await NFTCollection.deploy();

        await expect(nftCollection.mint(2)).to.be.revertedWith("NFTCollection: Invalid mint amount!");
      });

      
      xit("Should reject if (mintedbalance + mintAmount) > 10 ", async function () {
        const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
        const nftCollection = await NFTCollection.deploy();
        await nftCollection.mint(1, {value: '10000000000000000'});//1
        await nftCollection.mint(1, {value: '10000000000000000'});//2
        await nftCollection.mint(1, {value: '10000000000000000'});//3
        await nftCollection.mint(1, {value: '10000000000000000'});//4
        await nftCollection.mint(1, {value: '10000000000000000'});//5
        await nftCollection.mint(1, {value: '10000000000000000'});//6
        await nftCollection.mint(1, {value: '10000000000000000'});//7
        await nftCollection.mint(1, {value: '10000000000000000'});//8
        await nftCollection.mint(1, {value: '10000000000000000'});//9
        await nftCollection.mint(1, {value: '10000000000000000'});//10
        await expect(nftCollection.mint(1, {value: '10000000000000000'})).to.be.revertedWith("NFTCollection: User max minted exceeded!");//11

      });
      //@dev in smart contract change the maxSupply to 100 
      xit("Should reject if is reached to maxSupply ", async function () {
        const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
        const nftCollection = await NFTCollection.deploy();
        //const maxSupply = 336669;
        const maxSupply = 100;
        await nftCollection.setMaxMintAmount(maxSupply);
        await nftCollection.mint(maxSupply,{value: '100000000000000000'});
        await expect(nftCollection.mint(1 , {value: '1000000000000'})).to.be.revertedWith("NFTCollection: Max supply exceeded!");
      });

      xit("Should reject if value is less than mintCost * _mintAmount", async function () {
        const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
        const nftCollection = await NFTCollection.deploy();
        await expect(nftCollection.mint(1 , {value: '10'})).to.be.revertedWith("invalid value for minting");

      });

      xit("Should mint", async function () {
        const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
        const nftCollection = await NFTCollection.deploy();
        
      expect (await nftCollection.mint(1, { value: '1000000000000000'})).to.be.ok;  
      expect(await nftCollection.totalSupply()).to.be.equal(1);    
    
      });

      xit("Should send 55% of value to rewardAccount", async function () {
        const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
        const nftCollection = await NFTCollection.deploy();
        await nftCollection.mint(1, { value: '1000000000000000'});
        await expect(await web3.eth.getBalance(rewardAccount)).to.be.equal('550000000000000');

      });
    });


    describe("mintFounders", function () {

      xit("Should reject if caller is not the founder! ", async function () {

        const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
        const nftCollection = await NFTCollection.deploy();
  
       await expect(nftCollection.mintFounders(1)).to.be.revertedWith("NFTCollection: caller is not the founder!");

      });

      xit("Should reject if founderMintAmount = 0 ", async function () {

        const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
        const nftCollection = await NFTCollection.deploy();
               
        await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [founderAddress1],
        });

        await hre.network.provider.send("hardhat_setBalance", [
          "0xcFB0cF666A765669758905D876f16C963312Cea2",
          "0x1000000000000000000",
        ]);
        
       const founderAddressSigner = await ethers.getSigner(founderAddress1);
        await expect(nftCollection.connect(founderAddressSigner).mintFounders(0,{from: founderAddress1})).to.be.revertedWith("NFTCollection: Invalid mint amount!");

      });

      xit("Should reject if founderMintAmount = 101 ", async function () {
        const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
        const nftCollection = await NFTCollection.deploy();
               
        await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [founderAddress1],
        });

        await hre.network.provider.send("hardhat_setBalance", [
          "0xcFB0cF666A765669758905D876f16C963312Cea2",
          "0x1000000000000000000",
        ]);
        
       const founderAddressSigner = await ethers.getSigner(founderAddress1);
        await expect(nftCollection.connect(founderAddressSigner).mintFounders(101 ,{from: founderAddress1})).to.be.revertedWith("NFTCollection: Invalid mint amount!");

      });

      xit("Should reject if (founderMintedbalance + mintAmount) >= 100 ", async function () {
        const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
        const nftCollection = await NFTCollection.deploy();
               
        await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [founderAddress1],
        });

        await hre.network.provider.send("hardhat_setBalance", [
          "0xcFB0cF666A765669758905D876f16C963312Cea2",
          "0x1000000000000000000",
        ]);
        
       const founderAddressSigner = await ethers.getSigner(founderAddress1);
        await nftCollection.connect(founderAddressSigner).mintFounders(20,{from: founderAddress1});
        await expect(nftCollection.connect(founderAddressSigner).mintFounders(81,{from: founderAddress1})).to.be.revertedWith("NFTCollection: Max NFTCollection per founder exceeded");

      });

      xit("Should reject if is reached to maxSupply ", async function () {
        const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
        const nftCollection = await NFTCollection.deploy();
               
        await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [founderAddress1],
        });

        await hre.network.provider.send("hardhat_setBalance", [
          "0xcFB0cF666A765669758905D876f16C963312Cea2",
          "0x1000000000000000000",
        ]);
        
       const founderAddressSigner = await ethers.getSigner(founderAddress1);
       const maxSupply = 100;// @dev in smart contract change the maxSupply to 100
        await nftCollection.setMaxMintAmount(maxSupply);
        await nftCollection.mint(maxSupply,{value: '100000000000000000'});
        await expect(nftCollection.connect(founderAddressSigner).mintFounders(1,{from: founderAddress1})).to.be.revertedWith("NFTCollection: Max supply exceeded!");

      });

      xit("Should mint", async function () {
        const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
        const nftCollection = await NFTCollection.deploy();
               
        await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [founderAddress1],
        });

        await hre.network.provider.send("hardhat_setBalance", [
          "0xcFB0cF666A765669758905D876f16C963312Cea2",
          "0x1000000000000000000",
        ]);
        
       const founderAddressSigner = await ethers.getSigner(founderAddress1);
       await expect(nftCollection.connect(founderAddressSigner).mintFounders(1,{from: founderAddress1})).to.be.ok;
        expect(await nftCollection.totalSupply()).to.be.equal(1);

      });

    });

    
    describe("setCost", function () {

      xit("Should reject if sender is not the owner ", async function () {
        const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
        const nftCollection = await NFTCollection.deploy();
        await expect(nftCollection.setCost(0.0001,{from:'0xe89000B354F87DAba523A4142d648520a1A0Ab2c'})).to.be.rejected;

      });

      xit("Should set the mint cost ", async function () {
        const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
        const nftCollection = await NFTCollection.deploy();
       
       await nftCollection.setCost("10000000000000000");
       expect(await nftCollection.mintCost()).to.be.equal("10000000000000000");

      });
    });

    describe("setMaxMintAmount", function () {

      xit("Should reject if sender is not the owner ", async function () {
        const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
        const nftCollection = await NFTCollection.deploy();
        await expect(nftCollection.setMaxMintAmount(2 ,{from:'0xe89000B354F87DAba523A4142d648520a1A0Ab2c'})).to.be.rejected;  

      });

      xit("Should set the MaxMintAmount ", async function () {
        const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
        const nftCollection = await NFTCollection.deploy();
       
       await nftCollection.setMaxMintAmount(2);
       expect(await nftCollection.maxMintAmount()).to.be.equal(2);

      });
    });

    describe("setBaseURI", function () {

      xit("Should reject if sender is not the owner ", async function () {
        const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
        const nftCollection = await NFTCollection.deploy();
        const [owner, otherAccount] = await ethers.getSigners();
       
       await expect(nftCollection.connect(otherAccount).setBaseURI("ipfs://QmTDC875kXWmXdHii7QsT6PY6sPyKCxYuXVaFbjB4krcYt/")).to.be.reverted;
       
      });

      xit("Should set the baseURI ", async function () {

        const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
        const nftCollection = await NFTCollection.deploy();
        await nftCollection.setBaseURI("ipfs://pifjadpifijaspssfja/");
        expect(await nftCollection.baseURI()).to.be.equal("ipfs://pifjadpifijaspssfja/");
      });
    });

    describe("setBaseExtension", function () {

      xit("Should reject if sender is not the owner ", async function () {
        const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
        const nftCollection = await NFTCollection.deploy();
        const [owner, otherAccount] = await ethers.getSigners();
       
       await expect(nftCollection.connect(otherAccount).setBaseExtension(".json")).to.be.reverted;

      });

      xit("Should set the baseExtension ", async function () {
        const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
        const nftCollection = await NFTCollection.deploy();
        await nftCollection.setBaseExtension(".jpg");
        expect(await nftCollection.baseExtension()).to.be.equal(".jpg");

      });
    });

    describe("withdraw", function () {

      xit("Should reject if sender is not the owner ", async function () {
        const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
        const nftCollection = await NFTCollection.deploy();
        await expect(nftCollection.withdraw({from:'0xe89000B354F87DAba523A4142d648520a1A0Ab2c'})).to.be.rejected;

      });

      xit("Should send 33% of balance to each founder wallet as 1 mint", async function () {
        const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
        const nftCollection = await NFTCollection.deploy();

        await nftCollection.mint(1, { value: '1000000000000000'});//contract balance = 450000000000000
        const valueForEachFounder = (450000000000000 * 33)/100;

        await nftCollection.withdraw();
        await expect(await web3.eth.getBalance(founderAddress1)).to.be.equal(valueForEachFounder.toString());
        await expect(await web3.eth.getBalance(founderAddress2)).to.be.equal(valueForEachFounder.toString());
        await expect(await web3.eth.getBalance(founderAddress3)).to.be.equal(valueForEachFounder.toString());

      });

      xit("Should send 33% of balance to each founder wallet as 3 mint", async function () {
        const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
        const nftCollection = await NFTCollection.deploy();
        await nftCollection.mint(1, { value: '1000000000000000'});//contract balance = 450000000000000
        await nftCollection.mint(1, { value: '1000000000000000'});//contract balance = 900000000000000
        await nftCollection.mint(1, { value: '1000000000000000'});//contract balance = 1350000000000000
        
        const valueForEachFounder = (1350000000000000 * 33)/100;
        await nftCollection.withdraw();
        await expect(await web3.eth.getBalance(founderAddress1)).to.be.equal(valueForEachFounder.toString());
        await expect(await web3.eth.getBalance(founderAddress2)).to.be.equal(valueForEachFounder.toString());
        await expect(await web3.eth.getBalance(founderAddress3)).to.be.equal(valueForEachFounder.toString());

      });
    });

});
