<svelte:head>
	<title>Collection</title>
</svelte:head>

<script lang="ts">
	import CardContainer from '$lib/components/card/CardContainer.svelte';
  import { MTabGStorage } from '$lib/storage/storage'
  
  import { onMount } from 'svelte';

  let cards: Card[] = $state([]);

  onMount(async () => {
    cards = await MTabGStorage.getAllCards();
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
<button on:click={clearCards}>Clear collection</button>
<CardContainer cards={cards} />