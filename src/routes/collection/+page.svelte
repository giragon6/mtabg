<svelte:head>
	<title>Collection</title>
</svelte:head>

<script lang="ts">
	import CardContainer from '$lib/components/card/CardContainer.svelte';
  import QuotaStatus from './components/QuotaStatus.svelte'
  import ValueStatus from '$lib/components/ValueStatus.svelte'
  import { titleCase } from '$lib/util/formatUtil'
  import { MTabGStorage } from '$lib/storage/storage'
  import { SortOption, sortOrders } from '$lib/types/types'
  import { capitalismState } from '$lib/capitalism/capitalismMode.svelte.ts'
  
  import { onMount } from 'svelte';

  let cards: Card[] = $state([]);
  let storageUsedProgress: number | null = $state(null);
  let sortBy: SortOption = $state(SortOption.color)
  let isAscendingSort: boolean = $state(true);
  let isTableMode: boolean = $state(false);

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

  // not sure if it's better to do this via the dexie backend or manually like this
  function sortCards() {
    // TODO: less janky way of doing this
    const sortByKey = sortBy as keyof Card;
    const sbkeyString = sortByKey.toString();
    const sortSpecialOrder = (a, b) => {
      return sortOrders[sbkeyString][a[sortByKey]] < sortOrders[sbkeyString][b[sortByKey]] ? -1 : 1
    };
    const sortNormal = (a, b) => {
      return a[sortByKey] < b[sortByKey] ? -1 : 1
    };
    cards = cards.sort(Object.keys(sortOrders).includes(sbkeyString) ? sortSpecialOrder : sortNormal)
    if (!isAscendingSort) {
      cards = cards.reverse();
    }
  }

  function sellCard(card: Card) {

  }
</script>

<a href="/newtab"><button>Go back</button></a>
<button onclick={clearCards}>Clear collection</button><br>
<label for="storageUsed">Browser storage used:</label>
<QuotaStatus id="storageUsed" progress={storageUsedProgress} /><br>
<div class="sortFilterOptions">
  <select name="sortBy" bind:value={sortBy} onchange={sortCards}>
    {#each Object.values(SortOption) as s}
        <option value={s}>{titleCase(s)}</option>
    {/each}
  </select>
  <select name="isAscendingSort" bind:value={isAscendingSort} onchange={sortCards}>
    <option value={true}>Ascending</option>
    <option value={false}>Descending</option>
  </select>
  <button onclick={() => isTableMode = !isTableMode}>{isTableMode ? 'Dis' : 'En'}able Table Mode</button>
</div>

{#if capitalismState.capitalismMode}
  <ValueStatus cards={cards} /> 
{/if}

{#if isTableMode}
  <table>
    <thead>
    <tr>
      <th>Card Name</th>
      {#if capitalismState.capitalismMode}
        <th>Price</th>
        <th>Actions</th>
      {/if}
    </tr>
  </thead>
  <tbody>
    {#each cards as c}
    <tr>
      <td>{c.name}</td>
      {#if capitalismState.capitalismMode}
        <td>${c.price}</td>
        <td><button onclick={() => sellCard(c)}>Sell</button></td>
      {/if}
    </tr>
    {/each}
  </tbody>
  </table>
{:else}
  <CardContainer cards={cards} />
{/if}

<style>
  label {
    color: white;
  }

  select {
    font-size: medium;
  }

  .sortFilterOptions {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 10%;
    width: 80%;
  }

  table {
    margin: 5%;
  }

  tr {
    background-color: #e3e3e3;
  }

  tr:nth-child(even) {
    background-color: #c7c8c9;
  }
</style>