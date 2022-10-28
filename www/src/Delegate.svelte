<script lang="ts">
  let contractAddress: string;
  let tokenId: string;
  let vandalizerAddress: string;

  $: link =
    contractAddress && tokenId
      ? `https://testnets.opensea.io/assets/goerli/${contractAddress}/${tokenId}`
      : null;

  async function loadToken() {}
</script>

<h2>Delegate the vandalization of a token</h2>
<form on:submit|preventDefault={loadToken}>
  <div class="grid two">
    <div>
      <input
        placeholder="Contract address"
        required
        bind:value={contractAddress}
      />
    </div>
    <div>
      <input
        placeholder="Token Id"
        required
        type="number"
        bind:value={tokenId}
      />
    </div>
  </div>
  <input
    placeholder="Vandalizer address"
    required
    bind:value={vandalizerAddress}
  />
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
