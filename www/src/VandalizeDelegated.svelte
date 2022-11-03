<script lang="ts">
  import type { Signer } from "ethers";
  import { defaultAbiCoder } from "ethers/lib/utils";
  import type { CryptoVandals } from "../../typechain";

  export let cv: CryptoVandals;

  let tokenId: string;
  let tokenURI: string;

  async function handleSubmit() {
    cv.setTokenURI(tokenId, tokenURI);
  }
</script>

<h2>Vandalize delegated</h2>

<p>Someone asked you to vandalize their token.</p>

<form on:submit|preventDefault={handleSubmit}>
  <div class="grid">
    <div>
      <input placeholder="Token Id" required bind:value={tokenId} />
    </div>
    <div>
      <input placeholder="New Token URI" required bind:value={tokenURI} />
    </div>
  </div>
  <div>
    <button type="submit">Vandalize</button>
  </div>
</form>

<style>
  .grid {
    grid-template-columns: 1fr 3fr;
  }
</style>
