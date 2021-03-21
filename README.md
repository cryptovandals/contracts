![Test workflow](https://github.com/cryptovandals/contracts/actions/workflows/node.yml/badge.svg)

# CryptoVandals

```
 ▄████▄   ██▀███ ▓██   ██▓ ██▓███  ▄▄▄█████▓ ▒█████
▒██▀ ▀█  ▓██ ▒ ██▒▒██  ██▒▓██░  ██▒▓  ██▒ ▓▒▒██▒  ██▒
▒▓█    ▄ ▓██ ░▄█ ▒ ▒██ ██░▓██░ ██▓▒▒ ▓██░ ▒░▒██░  ██▒
▒▓▓▄ ▄██▒▒██▀▀█▄   ░ ▐██▓░▒██▄█▓▒ ▒░ ▓██▓ ░ ▒██   ██░
▒ ▓███▀ ░░██▓ ▒██▒ ░ ██▒▓░▒██▒ ░  ░  ▒██▒ ░ ░ ████▓▒░
░ ░▒ ▒  ░░ ▒▓ ░▒▓░  ██▒▒▒ ▒▓▒░ ░  ░  ▒ ░░   ░ ▒░▒░▒░
  ░  ▒     ░▒ ░ ▒░▓██ ░▒░ ░▒ ░         ░      ░ ▒ ▒░
░          ░░   ░ ▒ ▒ ░░  ░░         ░      ░ ░ ░ ▒
░ ░         ░     ░ ░                           ░ ░
░██▒   █▓ ▄▄▄     ░ ███▄    █ ▓█████▄  ▄▄▄       ██▓      ██████
▓██░   █▒▒████▄     ██ ▀█   █ ▒██▀ ██▌▒████▄    ▓██▒    ▒██    ▒
 ▓██  █▒░▒██  ▀█▄  ▓██  ▀█ ██▒░██   █▌▒██  ▀█▄  ▒██░    ░ ▓██▄
  ▒██ █░░░██▄▄▄▄██ ▓██▒  ▐▌██▒░▓█▄   ▌░██▄▄▄▄██ ▒██░      ▒   ██▒
   ▒▀█░   ▓█   ▓██▒▒██░   ▓██░░▒████▓  ▓█   ▓██▒░██████▒▒██████▒▒
   ░ ▐░   ▒▒   ▓▒█░░ ▒░   ▒ ▒  ▒▒▓  ▒  ▒▒   ▓▒█░░ ▒░▓  ░▒ ▒▓▒ ▒ ░
   ░ ░░    ▒   ▒▒ ░░ ░░   ░ ▒░ ░ ▒  ▒   ▒   ▒▒ ░░ ░ ▒  ░░ ░▒  ░ ░
     ░░    ░   ▒      ░   ░ ░  ░ ░  ░   ░   ▒     ░ ░   ░  ░  ░
      ░        ░  ░         ░    ░          ░  ░    ░  ░      ░
     ░                         ░
```

## What?
**CryptoVandals** is a tool that lets you liberate or vandalize NFTs you own.

The original NFT is burned and a new NFT is minted, still tied to the original.

A **liberated NFT** has proprietary links and gateways replaced by open, accessible, and content addressed IPFS links.

A **vandalized NFT** is liberated, but the original linked content is replaced by linked content of your choice.

## Why?
Our mission is set out in the [CryptoVandals Manifesto](https://github.com/cryptovandals/contracts/blob/main/MANIFESTO.md).

CryptoVandals liberates NFTs from the single points of failure created by the centralized storage and proprietary gateways used by NFT platforms. These single points of failure will almost inevitably lead to the loss of content if and when the platform hosting the content or gateway goes out of business (as raised by [@jonty](https://twitter.com/jonty/status/1372163423446917122)), or worse, if rug pulls replace the content you thought you bought with something else entirely (as demonstrated by [@neitherconfirm](https://twitter.com/neitherconfirm/status/1369285946198396928)).

## How?
Cryptovandals is made up of four pieces:
1. A **smart contract** that can liberate or vandalize an ERC-721 NFT.
2. A **command line interface** that lets you interact with the smart contract.
3. A **web application** that lets you interact with the smart contract.
4. A **[manifesto](https://github.com/cryptovandals/contracts/blob/main/MANIFESTO.md)** that guides our work.

CryptoVandals lets you:

**Liberate an NFT:** When you tell CryptoVandals to liberate an NFT, it uploads the linked content to IPFS and sends a single transaction from your address to the CryptoVandals contract. That transaction burns the original NFT by sending it to a null address ([`0x1`](https://etherscan.io/address/0x0000000000000000000000000000000000000001), because the default `0x0` can't accept ERC-721 tokens). That same transaction mints a liberated NFT, replacing the original links with open, accessible, content addressed IPFS links. The transaction sent to the CryptoVandals contract links to both the original NFT and the liberated NFT, maintaining the provenance of the original NFT.

**Vandalize an NFT:** When you tell CryptoVandals to vandalize an NFT, it does the same things as above, but it changes the original content links to reference new content. It could be a modified version of the same content or something entirely new.

## Who?
CryptoVandals is a [NFTHack](https://nfthack.ethglobal.co/) project by:
* [Alberto Granzotto](https://twitter.com/vrde), a blockchain developer based in Berlin, Germany. 
* [Greg McMullen](https://twitter.com/gmcmullen), a lawyer based in Vancouver, Canada.

Special thanks to:
* Tim Daubenschütz, a blockchain developer based in Berlin, Germany.

CryptoVandals was originally conceived by Alberto, Greg, and Tim in 2018 as a response to the restrictive terms of service in early NFT projects, [especially CryptoKitties](https://medium.com/@gmcmullen/do-you-really-own-your-cryptokitties-d2731d3491a9). We wanted digital ownership to be more like physical ownership... and if you own something, you can break it. Inspired by [Baseball Card Vandals](https://baseballcardvandals.com/), CryptoVandals was born from a rejection of non-negotiable terms of service and an urgent need to deface our CryptoKitties.

Alberto, Greg, and Tim all worked at [ascribe.io](https://ascribe.io), which in 2014 pioneered the concept of art-on-blockchain using Bitcoin, long before Ethereum and ERC-721. ascribe.io was used by artists around the world to register, sell, and loan their work, all on the Bitcoin blockchain. But the content was stored on AWS, so when ascribe.io was shut down all that art was lost forever. Only the blockchain ownership records remain. That gave the CryptoVandals crew first-hand experience in why NFTs shouldn't be anchored to any particular platform. 

The NTFHack version of CryptoVandals is an entirely new smart contract, application, and manifesto. It was inspired by the work done by our younger selves.

(template: https://github.com/rhlsthrm/typescript-solidity-dev-starter-kit)
