<script lang="ts">
  import Delegate from "./Delegate.svelte";
  import Vandalize from "./Vandalize.svelte";
  import VandalizeDelegated from "./VandalizeDelegated.svelte";
  import Header from "./Header.svelte";
  import { signer, init } from "./stores/wallet";
  import { cv } from "./stores/contract";

  const initializing = init();
</script>

{#await initializing}
  <p>Loading please wait…</p>
{:then}
  <Header />
  {#if $cv && $signer}
    <main class="container">
      <Vandalize cv={$cv} signer={$signer} />
      <Delegate cv={$cv} signer={$signer} />
      <VandalizeDelegated cv={$cv} />
      Address: {$cv.address}
    </main>
  {/if}
{:catch}
  <p>There was an error loading the page.</p>
{/await}
