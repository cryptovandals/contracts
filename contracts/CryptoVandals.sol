// contracts/CryptoVandals.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

/**
 * CryptoVandals.sol
 */

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CryptoVandals is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    event Vandalize(
        address indexed fromContract,
        uint256 indexed fromTokenId,
        uint256 indexed toTokenId
    );

    constructor() public ERC721("CryptoVandals", "CV") {}

    function mint(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(_msgSender(), newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    function mint(
        address owner,
        address fromContract1,
        uint256 fromTokenId1,
        address fromContract2,
        uint256 fromTokenId2,
        string memory toTokenURI
    ) public returns (uint256) {
        require(fromContract1.isContract());
        require(fromContract2 == address(0) || fromContract2.isContract());

        // Transfer to address 0x1 instead of 0x0, some contracts revert
        // otherwise.
        ERC721(fromContract1).transferFrom(owner, address(1), fromTokenId1);

        if (fromContract2 != address(0)) {
            ERC721(fromContract2).transferFrom(owner, address(1), fromTokenId2);
        }

        _tokenIds.increment();
        uint256 toTokenId = _tokenIds.current();
        _mint(_msgSender(), toTokenId);
        _setTokenURI(toTokenId, toTokenURI);

        emit Vandalize(fromContract1, fromTokenId1, toTokenId);

        if (fromContract2 != address(0)) {
            emit Vandalize(fromContract2, fromTokenId2, toTokenId);
        }

        return toTokenId;
    }

    function vandalize(
        address fromContract,
        uint256 fromTokenId,
        string calldata toTokenURI
    ) external {
        mint(msg.sender, fromContract, fromTokenId, address(0), 0, toTokenURI);
    }

    function vandalize2(
        address fromContract1,
        uint256 fromTokenId1,
        address fromContract2,
        uint256 fromTokenId2,
        string calldata toTokenURI
    ) external {
        mint(
            msg.sender,
            fromContract1,
            fromTokenId1,
            fromContract2,
            fromTokenId2,
            toTokenURI
        );
    }
}
