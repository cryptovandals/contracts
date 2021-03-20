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
**Cryptovandals** is a tool to liberate or vandalize the NFTs you own.

The original NFT is burned, and CryptoVandals mints a new NFT tied to the original.

A **liberated NFT** has proprietary links and gateways replaced by open, accessible, and content addressed IPFS links.

A **vandalized NFT** is also liberated, but has the original linked content replaced by linked content of your choice.

## Why?
Cryptovandals was conceived in 2018 as a response to the restrictive terms of service in early NFT projects, especially CryptoKitties. We wanted digital ownership to be more like physical ownership, and if you own something, you can break it. Inspired by [Baseball Card Vandals](https://baseballcardvandals.com/), CryptoVandals was born. We envisioned a system that could burn an NFT then mint a new NFT with a modified image.

The new Cryptovandals focuses on an even bigger problem—liberating NFTs from centralized content storage and IPFS gateways in NFT platforms. These single points of failure threaten to result in the loss of content if the platform hosting the gateway goes out of business (as raised by [@jonty](https://twitter.com/jonty/status/1372163423446917122)), or rug pulls that replace the content you thought you bought with something else entirely (as demonstrated by [@neitherconfirm](https://twitter.com/neitherconfirm/status/1369285946198396928)).

## How?
Cryptovandals is made up of three pieces:
1. A **Cryptovandals smart contract** deployed on the Ethereum mainnet that can liberate or vandalize an ERC-721 NFT in your wallet.
2. A **command line interface** (CLI) that can be used to interact with the Cryptovandals smart contract.
3. A **web interface** that lets you view your liberated and vandalized NFTs.

**Liberate a NFT:** When you tell the Cryptovandals CLI to liberate an NFT, it sends a transaction from your address to the Cryptovandals contract. This does two things. First, it burns the original NFT by sending it to a null address: [0x000...001](https://etherscan.io/address/0x0000000000000000000000000000000000000001). We used 01 instead of the default 00 because 00 can't accept ERC-721 tokens. Next, it mints a liberated NFT, replacing the original content links and any proprietary gateways with open, accessible, and content addressed IPFS links. The transaction sent to the contract links to both the original NFT and the liberated NFT, preserving the provinence of the original NFT.

**Vandalize a NFT:** When you tell the Cryptovandals CLI to vandalize an NFT, it does the same things as above, except it changes the original content links to reference new content. It could be a modified version of the same content or something entirely new.

## Who?
Cryptovandals is a NFTHack project by:
* [Alberto Granzotto](https://twitter.com/vrde), a blockchain developer based in Berlin, Germany.
* [Greg McMullen](https://twitter.com/gmcmullen), a lawyer based in Vancouver, Canada.

With special thanks to:
* Tim Daubenschütz, a blockchain developer based in Berlin, Germany.

Alberto, Greg, and Tim were all early team members of ascribe.io, which in 2015 pioneered the concept of art-on-blockchain using Bitcoin, back in the days before ERC-721 and Ethereum. The ascribe.io service allowed artists around the world to register, transfer, and loan works, all on the Bitcoin blockchain. But the content was stored on AWS, so when ascribe.io was shut down all that art was lost forever. Only the blockchain ownership records remain.

That gave the Cryptovandals crew first-hand experience in why NFTs shouldn't be anchored to any particular platform. That's why we think it's so important to be able to liberate NFTs.

(template: https://github.com/rhlsthrm/typescript-solidity-dev-starter-kit)
