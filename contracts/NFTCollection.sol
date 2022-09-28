//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTCollection is ERC721Enumerable, Ownable {
    using Strings for uint256;

    string public baseURI ="ipfs://QmTDC875kXWmXdHii7QsT6PY6sPyKCxYuXVaFbjB4krcYt/";
    string public baseExtension = ".json";

    uint256 public mintCost = 0.001 ether;
    uint256 public maxSupply = 336669;
    uint256 public maxMintAmount = 1; //the owner let users to mint in a single mint transaction
    uint256 public maxUserMint = 10;//max token that user can mint

    // founders addresses
    address public founder1 = 0xcFB0cF666A765669758905D876f16C963312Cea2; // owner
    address public founder2 = 0xd94ae54c9f302C899056eA88d9E278c1c2B85Fbe;
    address public founder3 = 0xACE4e59882A10440167f673CB9b8Cc83C8984D36;
    address public rewardAccount = 0xe89000B354F87DAba523A4142d648520a1A0Ab2c;

    
    modifier isFounder() {
        require(
            founder1 == _msgSender() ||
                founder2 == _msgSender() ||
                founder3 == _msgSender(),
            "NFTCollection: caller is not the founder!"
        );
        _;
    }

    constructor(
    ) ERC721("Pari", "TFM") {
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    // public mint
    function mint(uint256 _mintAmount) external payable {
        uint256 supply = totalSupply(); // current index NFTCollection
        uint256 mintedBalance = balanceOf(_msgSender()); // current minted balance of user
        require(_mintAmount > 0 && _mintAmount <= maxMintAmount, "NFTCollection: Invalid mint amount!");
        require(supply + _mintAmount <= maxSupply,"NFTCollection: Max supply exceeded!");
        require(mintedBalance + _mintAmount <= maxUserMint , "NFTCollection: User max minted exceeded!");

        // check if tx.value is correct
        require(mintCost * _mintAmount <= msg.value , "invalid value for minting");
        

        for (uint256 i = 1; i <= _mintAmount; i++) {
            _safeMint(_msgSender(), supply + i);
        }

       // uint256 

         (bool success, ) = payable(rewardAccount).call{
            value: (msg.value * 55) / 100
         }("");
         require(success, "NFTCollection: Withdraw failed!");
    }

    // private mint, only founders can call it
    function mintFounders(uint256 _mintAmount) external isFounder {
        uint256 supply = totalSupply(); // current index NFT
        uint256 founderMintedBalance = balanceOf(_msgSender());
        require(_mintAmount > 0 && _mintAmount <= 100, "NFTCollection: Invalid mint amount!");
        require(supply + _mintAmount <= maxSupply,"NFTCollection: Max supply exceeded!");
        require(founderMintedBalance + _mintAmount <= 100, "NFTCollection: Max NFTCollection per founder exceeded");

        for (uint256 i = 1; i <= _mintAmount; i++) {
            _safeMint(_msgSender(), supply + i);
        }

            }


    
    // return token metadata uri like "ipfs://QmTDC875kXWkm/1.json"
    function tokenURI(uint256 tokenId) public view override returns (string memory)
    {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension))
                : "";
    }



    // set new cost for minting
    function setCost(uint256 _newCost) external onlyOwner {
        mintCost = _newCost;
    }

    // set maximum mint amount for every time user call mint function
    function setMaxMintAmount(uint256 _newMaxMintAmount) external onlyOwner {
        maxMintAmount = _newMaxMintAmount;
    }

    // set new revealed uri
    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseURI = _newBaseURI;
    }

    // set base extension like ".json"
    function setBaseExtension(string memory _newBaseExtension) external onlyOwner {
        baseExtension = _newBaseExtension;
    }

    // withdraw costs from smart contract.
    // ethers divide between founders
    function withdraw() external onlyOwner {
        uint256 value = address(this).balance;
        (bool success1, ) = payable(founder1).call{value: (value * 33) / 100}(
            ""
        );
        require(success1, "NFTCollection: Withdraw failed!");
        (bool success2, ) = payable(founder2).call{value: (value * 33) / 100}(
            ""
        );
        require(success2, "NFTCollection: Withdraw failed!");
        (bool success3, ) = payable(founder3).call{value: (value * 33) / 100}(
            ""
        );
        require(success3, "NFTCollection: Withdraw failed!");
    }


}