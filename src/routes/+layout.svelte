<script lang="ts">
  import { collectionValueState } from '$lib/capitalism/collectionValue.svelte.ts'
  import { afterNavigate } from '$app/navigation'
  import { MTabGStorage } from '$lib/storage/storage'

  import { onMount } from 'svelte';
  const { children } = $props();
  
  async function updateCollectionValue() {
    const cards = await MTabGStorage.getAllCards();
    const collectionValue = cards.reduce(
      (acc, cur) => acc + Number(cur.price),
      0
    ); 
    collectionValueState.value = collectionValue;
    console.log(collectionValue)
  }

  onMount(async () => {
    await updateCollectionValue();
    afterNavigate(async () => await updateCollectionValue());
  })
</script>

<div class="container">
  {@render children()} 
  <footer style="text-align: center;">
    Magic: The Gathering is the intellectual property of Wizards of the Coast LLC, a subsidiary of Hasbro, Inc. Card API by Scryfall.
  </footer>
</div>

<style>
  :global(html, body) {
    height: 100%;
    width: 100%;
    margin: 0;
    font-family: 'Courier New', Courier, monospace;
  }

  :global(body) {
    height: 100%;
    background-size: cover;
    background: linear-gradient(#222a68, #574ae2) no-repeat fixed;
  }

  :global(button) {
    font-size: medium;
  }

  footer {
    text-align: center;
    color: white;
  }

  .container {
    min-height: 100%;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
</style>