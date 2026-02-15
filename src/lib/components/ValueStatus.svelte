<script lang='ts'>
  import { collectionValueState, refreshAndSyncCardVals } from '$lib/capitalism/collectionValue.svelte.ts'
  let { cards = [] } = $props();

  let loading: boolean = $state(false);
  let errMsg: string | null = $state(null);

  async function refreshCollectionValue() {
    errMsg = null;
    loading = true;
    const success = await refreshAndSyncCardVals(cards);
    if (success) {
      await new Promise(r => setTimeout(r, 2000)); //wait to prevent refresh spam
      loading = false;
    } else {
      errMsg = "Failed to refresh collection value";
      loading = false;
    }
  }
</script>

<p class="cardsValue">Collection value: ${collectionValueState.value.toFixed(2)}</p>
<button onclick={async () => await refreshCollectionValue()} disabled={loading}>Refresh Collection Value</button>
{#if errMsg}
  <p class="errorMessage">Collection value error: {errMsg}</p>
{/if}

<style>
  .cardsValue {
    color: white;
  }
</style>