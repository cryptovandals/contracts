<script lang="ts">
  import { Contract, Signer } from "ethers";
  import { defaultAbiCoder } from "ethers/lib/utils";
  import type { CryptoVandals } from "../../typechain";

  export let signer: Signer;
  export let cv: CryptoVandals;

  let contractAddress: string;
  let tokenId: string;
  let tokenURI: string;

  $: link =
    contractAddress && tokenId
      ? `https://testnets.opensea.io/assets/goerli/${contractAddress}/${tokenId}`
      : null;

  async function handleSubmit() {
    const payload = defaultAbiCoder.encode(
      ["uint", "string"],
      [0x10, tokenURI]
    );
    const c = new Contract(
      contractAddress,
      ["function safeTransferFrom(address,address,uint256,bytes)"],
      signer
    );
    await c["safeTransferFrom(address,address,uint256,bytes)"](
      await signer.getAddress(),
      cv.address,
      tokenId,
      payload
    );
  }
</script>

<h2>Vandalize a token</h2>

<form on:submit|preventDefault={handleSubmit}>
  <div class="grid two">
    <div>
      <input
        placeholder="Contract address"
        required
        bind:value={contractAddress}
      />
    </div>
    <div>
      <input placeholder="Token Id" required bind:value={tokenId} />
    </div>
  </div>
  <input placeholder="New Token URI" required bind:value={tokenURI} />
  <div class="grid">
    <div>
      <button type="submit">Sign transaction</button>
    </div>
    <div>
      <a
        href={link}
        role="button"
        class="contrast outline"
        target="_blank"
        rel="noreferrer">View token</a
      >
    </div>
  </div>
</form>

<style>
  .two {
    grid-template-columns: 3fr 1fr;
  }

  a[role="button"] {
    display: block;
  }
</style>
