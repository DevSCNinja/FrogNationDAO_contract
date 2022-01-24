// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract FrogNFT is ERC721Enumerable, Ownable {
    using Strings for uint256;

    uint256 public immutable maxSupply;
    uint256 public price = 69 ether;
    string public baseTokenURI;

    uint256 public lastTokenId;
    mapping(uint256 => uint256) public lastClaimed;

    address public treasureAddress;
    uint256 public treasureBalance;

    uint256 private _rewardTotalPerMint = 6.174276090370557983 ether;
    uint256 private _rewardPerMint = 1.19025 ether;
    uint256 private _rewardBatchSize = 100;

    constructor(
        string memory name_,
        string memory symbol_,
        string memory baseTokenURI_,
        uint256 maxSupply_,
        uint256 lastTokenId_,
        address treasureAddress_
    ) ERC721(name_, symbol_){
        baseTokenURI = baseTokenURI_;
        maxSupply = maxSupply_;
        lastTokenId = lastTokenId_;
        treasureAddress = treasureAddress_;
    }

    receive() external payable {}

    function mint(
        uint256 count
    ) public payable {
        uint256 total = count * 2;
        require(lastTokenId + total <= maxSupply, "Mint exceed max supply");
        require(price * count <= msg.value, "Value sent is not correct");

        for (uint256 i = 1; i <= total; i++) {
            _safeMint(msg.sender, lastTokenId + i);
        }

        lastTokenId += total;
        treasureBalance += msg.value - (_rewardTotalPerMint * total);
    }

    function claimReward(
        uint256 tokenId
    ) public {
        _claimReward(tokenId);
    }

    function claimRewards(
    ) public {
        uint256 balance = balanceOf(msg.sender);
        for (uint256 i = 0; i < balance; i++) {
            uint256 tokenId = tokenOfOwnerByIndex(msg.sender, i);
            if (_hasReward(tokenId)) _claimReward(tokenId);
        }
    }

    function withdrawTreasure(
    ) public onlyOwner {
        uint256 amount = treasureBalance;
        treasureBalance = 0;
        payable(treasureAddress).transfer(amount);
    }

    // used to migrate holders to this contract
    function airdrop(
        address[] calldata addresses,
        uint256[] calldata tokenIds
    ) public onlyOwner {
        require(addresses.length == tokenIds.length, "Incorrect length");
        for (uint256 i; i < addresses.length; i++) {
            _safeMint(addresses[i], tokenIds[i]);
        }
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(_exists(tokenId), "URI query for nonexistent token");
        return string(abi.encodePacked(baseTokenURI, tokenId.toString(), ".json"));
    }

    function getReward(
        uint256 tokenId
    ) public view returns (uint256){
        (uint256 reward,) = _calculateReward(tokenId);
        return reward;
    }

    function getRewards(
        address owner
    ) public view returns (uint256){
        uint256 allRewards;
        uint256 balance = balanceOf(owner);
        for (uint256 i = 0; i < balance; i++) {
            uint256 tokenId = tokenOfOwnerByIndex(owner, i);
            (uint256 reward,) = _calculateReward(tokenId);
            allRewards += reward;
        }
        return allRewards;
    }

    function tokensOfOwner(
        address owner
    ) public view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](balance);
        for (uint256 i = 0; i < balance; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(owner, i);
        }
        return tokenIds;
    }

    function setBaseURI(
        string calldata baseTokenURI_
    ) external onlyOwner {
        baseTokenURI = baseTokenURI_;
    }

    function setPrice(
        uint256 price_
    ) external onlyOwner {
        price = price_;
    }

    function _hasReward(
        uint256 tokenId
    ) private view returns (bool) {
        uint256 lastClaimedTokenId = lastClaimed[tokenId];
        if (lastClaimedTokenId == 0) lastClaimedTokenId = tokenId;
        return lastTokenId - lastClaimedTokenId > 0 && lastClaimedTokenId - tokenId < _rewardBatchSize;
    }

    function _calculateReward(
        uint256 tokenId
    ) private view returns (uint256, uint256) {
        uint256 lastClaimedTokenId = lastClaimed[tokenId];
        if (lastClaimedTokenId == 0) lastClaimedTokenId = tokenId;

        uint256 claimFrom = lastClaimedTokenId + 1 - tokenId;
        uint256 claimTo = lastTokenId - tokenId > _rewardBatchSize ? _rewardBatchSize : lastTokenId - tokenId;

        uint256 reward;
        for (uint256 i = claimFrom; i <= claimTo; i++) {
            reward += _rewardPerMint / i;
        }

        return (reward, tokenId + claimTo);
    }

    function _claimReward(
        uint256 tokenId
    ) private {
        require(msg.sender == ownerOf(tokenId), "caller is not the token owner");
        (uint256 reward, uint256 claimedUntilTokenId) = _calculateReward(tokenId);
        require(reward > 0, "None reward");
        lastClaimed[tokenId] = claimedUntilTokenId;
        payable(msg.sender).transfer(reward);
    }
}
