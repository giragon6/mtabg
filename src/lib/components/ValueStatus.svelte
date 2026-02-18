<script lang='ts'>
  import { capitalismState } from '$lib/capitalism/capitalismMode.svelte'
  import { refreshAndSyncCardVals } from '$lib/capitalism/collectionValue.svelte'
  
  let { cards = [] } = $props();

  let loading: boolean = $state(false);
  let errMsg: string | null = $state(null);
  let inDebt: boolean = $derived(capitalismState.money < 0);

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

<div class="capitalismStatus">
  <p class="cardsValue">Collection value: ${capitalismState.collectionValue.toFixed(2)}</p>
  <p class="money" style="color: {inDebt ? "red" : "green"};">
    Money: {inDebt ? '-' : ''}${inDebt ? capitalismState.money.toFixed(2).slice(1) : capitalismState.money.toFixed(2)}
  </p>
  <button onclick={async () => await refreshCollectionValue()} disabled={loading}>Refresh Collection Value</button>
</div>
{#if errMsg}
  <p class="errorMessage">Collection value error: {errMsg}</p>
{/if}

<style>
  .capitalismStatus {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 0;
    margin: 20px;
  }

  .cardsValue {
    color: white;
  }

  .money {
    color: white;
  }

  p {
    margin: 5px;
  }
</style>