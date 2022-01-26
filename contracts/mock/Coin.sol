// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract Coin is ERC20Burnable {

    uint256 public immutable maxSupply;

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 maxSupply_,
        address treasureAddress_
    ) ERC20(name_, symbol_) {
        maxSupply = maxSupply_;
        _mint(treasureAddress_, maxSupply_);
    }
}
