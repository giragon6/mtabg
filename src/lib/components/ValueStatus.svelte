<script lang='ts'>
  // import CardFetcher from '$lib/util/cardFetcher'
  import { collectionValueState } from '$lib/capitalism/collectionValue.svelte.ts'

  // let loading: boolean = $state(false);
  // let { cards = [] } = $props();
  // const fetcher = new CardFetcher();
</script>

<p class="cardsValue">Collection value: ${collectionValueState.value.toFixed(2)}</p>
<!-- <button onclick={refreshCardVals} disabled={loading}>Refresh Collection Value</button> -->

<style>
  .cardsValue {
    color: white;
  }
</style>