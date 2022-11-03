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

contract CryptoVandalsOld is ERC721Royalty, Ownable {
    bytes[] internal _data;
    string[] internal _tokenURIs;

    event Vandalize(
        address indexed operator,
        address indexed fromContract,
        uint256 indexed fromTokenId,
        uint256 toTokenId
    );

    constructor() ERC721("CryptoVandals", "CV") {
        // Skip tokenId 0, first token minted will have tokenId 1
        _data.push();
    }

    function tokenURI(uint tokenId)
        public
        view
        override
        returns (string memory)
    {
        bytes memory data = _data[tokenId];
        if (data[0] == 0x10) {
            return abi.decode(data, (string));
        } else {
            address from;
            uint id;
            assembly {
                from := mload(add(data, 0x20))
                id := mload(add(data, 0x40))
            }
            console.log(from);
            console.log(id);
            return ERC721(from).tokenURI(id);
        }
    }

    function _execute(
        address from,
        uint id,
        bytes calldata data
    ) private pure returns (bytes memory newData) {
        if (data.length == 0) {
            // Pack op code and address together to save storing a word just for
            // the 1-byte opcode
            newData = abi.encode((0x01 << (256 - 8)) | uint160(from), id);
        } else if (data[0] == 0x02) {
            // Store the 1-byte opcode together with the original contract in a
            // uint256
            address vandalAddress = address(
                uint160(uint256(bytes32(data[0:32])))
            );
            newData = abi.encode(
                (0x02 << (256 - 8)) | uint160(from),
                id,
                vandalAddress
            );
        } else if (
            data.length > 32 &&
            data[0] == 0x10 &&
            // From the second byte we have a string. The first word of a string
            // represents its length. The first byte of the length is the MSB, and it must be zero
            // otherwise it means we are storing a string
            data[1] != 0x01 &&
            data[1] != 0x02
        ) {
            // Store the string
            newData = data[1:];
        } else {
            revert("CV: invalid opcode");
        }
    }

    function setTokenURI(uint tokenId, bytes calldata uri) public {
        bytes memory data = _data[tokenId];
        address msgSender = _msgSender();
        if (data[0] == 0x01 || data[0] == 0x02) {
            address from;
            uint id;
            assembly {
                from := mload(add(data, 0x20))
                id := mload(add(data, 0x40))
            }
            if (data[0] == 0x01) {
                require(msgSender == ownerOf(tokenId), "CV: not allowed");
            } else if (data[0] == 0x02) {
                address vandalAddress;
                assembly {
                    vandalAddress := mload(add(data, 0x40))
                }
                require(
                    msgSender == vandalAddress || msgSender == ownerOf(tokenId),
                    "CV: not allowed"
                );
            }
            _data[tokenId] = _execute(from, id, uri);
        } else {
            revert("CV: not allowed");
        }
    }

    function onERC721Received(
        address,
        address from,
        uint256 id,
        bytes calldata data
    ) external returns (bytes4) {
        _mint(from, _data.length);
        emit Vandalize(from, _msgSender(), id, _data.length);
        _data.push(_execute(_msgSender(), id, data));
        return this.onERC721Received.selector;
    }

    /*
    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) public returns (bytes4) {
        // CV cannot vandalize more than one token
        require(value == 1, "CV: multiple tokens");
        _mint(operator, _data.length);
        emit Vandalize(operator, _msgSender(), id, _data.length);
        _data.push(_execute(from, id, data));
        return this.onERC1155Received.selector;
    }
    */
}
