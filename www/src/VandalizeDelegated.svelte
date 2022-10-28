<script lang="ts">
  let tokenId: string;
  let tokenURI: string;

  async function loadToken() {}
</script>

<h2>Vandalize delegated</h2>
<p>Someone asked you to vandalize their token.</p>
<form on:submit|preventDefault={loadToken}>
  <div class="grid">
    <div>
      <input
        placeholder="Token Id"
        required
        type="number"
        bind:value={tokenId}
      />
    </div>
    <div>
      <input placeholder="Token URI" required bind:value={tokenURI} />
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
