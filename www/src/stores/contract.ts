import { type Readable, derived } from "svelte/store";
import { CryptoVandals__factory, type CryptoVandals } from "../../../typechain";
import { contractsAddresses } from "./config";
import { chainId, networkError, signer } from "./wallet";

export const cv: Readable<CryptoVandals | null> = derived(
  [networkError, signer, chainId],
  ([$networkError, $signer, $chainId], set) => {
    if (!$networkError && $signer && $chainId) {
      set(
        CryptoVandals__factory.connect(
          contractsAddresses["CryptoVandals"],
          $signer
        )
      );
    } else {
      set(null);
    }
  }
);
