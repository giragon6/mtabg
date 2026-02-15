<svelte:head>
	<title>Collection</title>
</svelte:head>

<script lang="ts">
	import CardContainer from '$lib/components/card/CardContainer.svelte';
  import QuotaStatus from './components/QuotaStatus.svelte'
  import { MTabGStorage } from '$lib/storage/storage'
  
  import { onMount } from 'svelte';

  let cards: Card[] = $state([]);
  let storageUsedProgress: number | null = $state(null);

  onMount(async () => {
    cards = await MTabGStorage.getAllCards();
    const quotaStatus: QuotaReport = await MTabGStorage.getEstimatedQuota();
    const storageQuota = quotaStatus.quota;
    const storageUsed = quotaStatus.usage;
    storageUsedProgress = (storageUsed && storageQuota) ? storageUsed / storageQuota : null;
  })

  async function clearCards() {
    const confirm = window.confirm("Really clear your collection? This can't be undone!");
    if (confirm) {
      const success = await MTabGStorage.removeAllCards();
      if (success) {
        cards = []; 
      }
    }
  }
</script>

<a href="/newtab"><button>Go back</button></a>
<button onclick={clearCards}>Clear collection</button><br>
<label for="storageUsed">Browser storage used:</label>
<QuotaStatus id="storageUsed" progress={storageUsedProgress} />
<CardContainer cards={cards} />

<style>
  label {
    color: white;
  }
</style>