// contracts/Kitty.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

/**
 * This is a generic ERC721 contract that we use in tests to generate NFTs to
 * vandalize.
 * Code from https://docs.openzeppelin.com/contracts/3.x/erc721#constructing_an_erc721_token_contract
 */

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Kitty is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() public ERC721("Kitty", "K") {}

    function mint(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(_msgSender(), newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}
