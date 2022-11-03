// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/**
 *      (                         )
 *      )\   (    (            ( /(
 *    (((_)  )(   )\ )  `  )   )\()) (
 *    )\___ (()\ (()/(  /(/(  (_))/  )\
 *   ((/ __| ((_) )(_))((_)_\ | |_  ((_)
 *    | (__ | '_|| || || '_ \)|  _|/ _ \
 *     \___||_|   \_, || .__/  \__|\___/
 *                |__/ |_|  (          (
 *     (   (     )          )\ )    )  )\
 *     )\  )\ ( /(   (     (()/( ( /( ((_)(
 *    ((_)((_))(_))  )\ )   ((_)))(_)) _  )\
 *    \ \ / /((_)_  _(_/(   _| |((_)_ | |((_)
 *     \ V / / _` || ' \))/ _` |/ _` || |(_-<
 *      \_/  \__,_||_||_| \__,_|\__,_||_|/__/
 *
 *
 */

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract CryptoVandals is ERC721Royalty, Ownable {
    bytes[] internal _data;
    string[] internal _tokenURIs;
    uint256 internal lastTokenId;

    struct Source {
        address from;
        uint256 id;
    }

    struct SourceVandalize {
        address from;
        uint256 id;
        address vandalizer;
    }

    mapping(uint => string) internal tokenIdToURI;
    mapping(uint => Source) internal tokenIdToSource;
    mapping(uint => SourceVandalize) internal tokenIdToVandalizer;

    event Vandalize(
        address indexed operator,
        address indexed fromContract,
        uint256 indexed fromTokenId,
        uint256 toTokenId
    );

    constructor() ERC721("CryptoVandals", "CV") {}

    function onERC721Received(
        address,
        address from,
        uint256 id,
        bytes calldata data
    ) external returns (bytes4) {
        lastTokenId++;
        _mint(from, lastTokenId);
        emit Vandalize(from, _msgSender(), id, lastTokenId);
        if (data.length == 0) {
            tokenIdToSource[lastTokenId] = Source(_msgSender(), id);
        } else {
            uint op = abi.decode(data, (uint));
            if (op == 0x02) {
                (, address vandalizer) = abi.decode(data, (uint, address));
                tokenIdToVandalizer[lastTokenId] = SourceVandalize(
                    _msgSender(),
                    id,
                    vandalizer
                );
            } else if (op == 0x10) {
                (, string memory uri) = abi.decode(data, (uint, string));
                tokenIdToURI[lastTokenId] = uri;
            }
        }
        return this.onERC721Received.selector;
    }

    function tokenURI(uint tokenId)
        public
        view
        override
        returns (string memory)
    {
        if (bytes(tokenIdToURI[tokenId]).length > 0) {
            return tokenIdToURI[tokenId];
        } else if (tokenIdToSource[tokenId].from != address(0)) {
            return
                ERC721(tokenIdToSource[tokenId].from).tokenURI(
                    tokenIdToSource[tokenId].id
                );
        } else if (tokenIdToVandalizer[tokenId].from != address(0)) {
            return
                ERC721(tokenIdToVandalizer[tokenId].from).tokenURI(
                    tokenIdToVandalizer[tokenId].id
                );
        }
        revert("CV: not found");
    }

    function setTokenURI(uint tokenId, string calldata uri) public {
        if (bytes(tokenIdToURI[tokenId]).length > 0) {
            revert("CV: immutable");
        } else if (tokenIdToSource[tokenId].from != address(0)) {
            require(ownerOf(tokenId) == _msgSender(), "CV: forbidden");
            delete tokenIdToSource[tokenId];
            tokenIdToURI[tokenId] = uri;
        } else if (tokenIdToVandalizer[tokenId].from != address(0)) {
            require(
                tokenIdToVandalizer[tokenId].vandalizer == _msgSender(),
                "CV: forbidden"
            );
            delete tokenIdToVandalizer[tokenId];
            tokenIdToURI[tokenId] = uri;
        } else {
            revert("CV: not found");
        }
    }
}
