<script lang="ts">
  import ConnectWallet from "./ConnectWallet.svelte";
  import {
    signer,
    address,
    balance,
    network,
    networkError,
    connect,
  } from "./stores/wallet";
</script>

{#if $networkError}
  <p>
    To use this app, connect your wallet to <strong>
      {$networkError.want}
    </strong>
  </p>
{/if}

<nav class="container-fluid">
  <ul>
    <li><strong>Crypto Vandals</strong></li>
  </ul>
  <ul>
    {#if $signer}
      <li>{$address}</li>
    {/if}
    <li>
      <ConnectWallet />
    </li>
  </ul>
</nav>
