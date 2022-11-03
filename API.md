# CryptoVandals.sol

CryptoVandals (CV from now on) is a smart contract (protocol maybe?) to vandalize existing NFTs. If you own a token and you want to vandalize it, then you can do one of the following things:

- Transfer the token to CV. This will mint a new token in the CV contract. The new token is owned by you and it just mirrors the original token. The new token is **not yet** vandalized.
- Transfer the token to CV and add a payload to the transfer metadata, see section below.

## Smart contract API

Tokens can be in two states:

- Ready to be vandalized (opcode < `0x10`)
- Vandalized (opcode >= `0x10`)

If a token is ready to be vandalized, the owner of that token can decide what's next for it. They can vandalize the token themselves by setting a new `tokenURI`, or they can delegate vandalization to another addess.

Once a token is vandalized, the owner cannot change the `tokenURI` anymore, nor delegate the vandalization to another address.

To vandalize a token again it has to be sent to the CV contract. This will "soft burn" the old token and mint a new one.

### `onERC721Received`, `onERC1155Received` payload

Bytecode:

#### No payload

The token is transferred to CryptoVandals, a new token is minted and assigned to `msg.sender`. The `tokenURI` of the new token returns the value of the original token.

Internally, the payload is set to:

- `0x01`   
- `fromAddress` (type `address`) the source contract address.
- `fromTokenId` (type `uint256`) the source token id.

The token can still be vandalized by its owner.

If the original token implements EIP-2981, the wrapped token mirrors the original royalty fee.

#### Delegate Vandalization

- `0x02`
- `vandalAddress` (type `address`) address allowed to vandalize the token
- `vandalRoyalty` (type `uint96`) royalty split for the vandalizer (denominator is `10000`, so for 20% the value is `200000`)

The token is transferred to CryptoVandals, a new token is minted and assigned to the caller. The `tokenURI` of the new token returns the value of the original token. `address` can override `tokenURI`.

The token can be vandalized by the specified `address`.

Internally, the payload is set to:

- `0x02`
- `fromAddress` (type `address`) the source contract address.
- `fromTokenId` (type `uint256`) the source token id.
- `vandalAddress` (type `address`) address allowed to vandalize the token

#### Set the `tokenURI`

- `0x10`

The token is transferred to CryptoVandals, a new token is minted and assigned to `msg.sender`. The `tokenURI` of the new token points to the URI specified in the payload.

The token cannot be vandalized anymore.

Internally, the payload is set to the string 

### `setTokenURI(uint256 tokenId, bytes uri)`

If:

- `tokenId` exists.
- `tokenId` has not been vandalized yet.
- `msg.sender` is:
    - The owner of the token; or
    - An address that can vandalize the token.

Then: update the URI of the token.