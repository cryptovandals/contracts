<script lang="ts">
  import Delegate from "./Delegate.svelte";
  import Vandalize from "./Vandalize.svelte";
  import VandalizeDelegated from "./VandalizeDelegated.svelte";
  import Header from "./Header.svelte";
  import { init } from "./stores/wallet";

  const initializing = init();
</script>

{#await initializing}
  <p>Loading please wait…</p>
{:then}
  <Header />
  <main class="container">
    <Vandalize />
    <Delegate />
    <VandalizeDelegated />
  </main>
{:catch}
  <p>There was an error loading the page.</p>
{/await}
