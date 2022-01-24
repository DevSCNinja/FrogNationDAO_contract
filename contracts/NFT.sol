// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "hardhat/console.sol";

contract NFT is ERC721Enumerable, Ownable {
    using Strings for uint256;

    uint256 public maxSupply;
    uint256 public price;
    uint256 public nextTokenId = 1;
    mapping(uint256 => uint256) public claimed;

    IERC721 public frogNFT;
    address public farmAddress;
    address public teamAddress;

    uint256 private constant REWARD_AGES = 10;
    uint256 private constant REWARD_PERCENTAGE = 500; // 50%
    uint256 private constant FARM_PERCENTAGE = 400; // 40%
    uint256 private constant TEAM_PERCENTAGE = 100; // 10%
    uint256 private constant DISCOUNT_PERCENTAGE = 50; // 5%
    string private _tokenURI;

    event RewardClaimed(address indexed owner, uint256 indexed tokenId, uint256 reward);

    constructor(
        uint256 maxSupply_,
        uint256 price_,
        address farmAddress_,
        address teamAddress_,
        address frogNFTAddress_,
        string memory tokenURI_
    ) ERC721("NFT", "NFT") {
        maxSupply = maxSupply_;
        price = price_;
        farmAddress = farmAddress_;
        teamAddress = teamAddress_;
        frogNFT = IERC721(frogNFTAddress_);
        _tokenURI = tokenURI_;
    }

    function mint(
        uint256 total
    ) public payable {
        require(total > 0, "Mint total is zero");
        require(maxSupply >= nextTokenId + total - 1, "Mint exceed max supply");

        uint256 totalPrice = price * total;
        uint256 discount = hasDiscount(msg.sender) ? totalPrice * DISCOUNT_PERCENTAGE / 1000 : 0;
        require(msg.value >= totalPrice - discount, "Value sent is not correct");

        for (uint256 i; i < total; i++) {
            _safeMint(msg.sender, nextTokenId + i);
        }

        nextTokenId += total;

        uint256 rewardAmount = totalPrice * REWARD_PERCENTAGE / 1000;
        uint256 farmAmount = (totalPrice * FARM_PERCENTAGE / 1000) - discount;
        uint256 teamAmount = msg.value - rewardAmount - farmAmount;

        payable(teamAddress).transfer(teamAmount);
        payable(farmAddress).transfer(farmAmount);
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
            _claimReward(tokenId);
        }
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return _tokenURI;
    }

    function getReward(
        uint256 tokenId
    ) public view returns (uint256){
        return _calculateReward(tokenId);
    }

    function getRewards(
        address account
    ) public view returns (uint256){
        uint256 rewards;
        uint256 balance = balanceOf(account);
        for (uint256 i = 0; i < balance; i++) {
            uint256 tokenId = tokenOfOwnerByIndex(account, i);
            rewards += _calculateReward(tokenId);
        }
        return rewards;
    }

    function hasDiscount(
        address account
    ) public view returns (bool) {
        return frogNFT.balanceOf(account) > 0;
    }

    function setTokenURI(
        string calldata tokenURI_
    ) external onlyOwner {
        _tokenURI = tokenURI_;
    }

    function setPrice(
        uint256 price_
    ) external onlyOwner {
        price = price_;
    }

    function _calculateReward(
        uint256 tokenId
    ) private view returns (uint256) {
        uint256 rewardAge = nextTokenId - tokenId - 1;
        if (rewardAge > REWARD_AGES) rewardAge = REWARD_AGES;
        uint256 totalReward = rewardAge * price * REWARD_PERCENTAGE / 1000 / REWARD_AGES;
        uint256 reward = totalReward - claimed[tokenId];
        return reward;
    }

    function _claimReward(
        uint256 tokenId
    ) private {
        require(msg.sender == ownerOf(tokenId), "caller is not the token owner");
        uint256 reward = _calculateReward(tokenId);
        if (reward > 0) {
            claimed[tokenId] += reward;
            payable(msg.sender).transfer(reward);
            emit RewardClaimed(msg.sender, tokenId, reward);
        }
    }
}
