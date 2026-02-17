<svelte:head>
	<title>Collection</title>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';
  import { capitalismState } from '$lib/capitalism/capitalismMode.svelte'
	import CardContainer from '$lib/components/card/CardContainer.svelte';
  import ValueStatus from '$lib/components/ValueStatus.svelte'
	import type Card from '$lib/models/card';
  import { MTabGStorage } from '$lib/storage/storage'
  import { MtGColor, SortOption, sortOrders, type QuotaReport } from '$lib/types/types'
  import { titleCase } from '$lib/util/formatUtil'
  
  import QuotaStatus from './components/QuotaStatus.svelte'
	import TableView from './components/TableView.svelte';

  let cards: Card[] = $state([]);
  let storageUsedProgress: number | null = $state(null);
  let sortBy: SortOption = $state(SortOption.colors)
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
    const sortByKey = sortBy as SortOption;
    const sbkeyString = sortByKey.toString();
    const sortSpecialOrder = (a: Card, b: Card) => {
      const aSortVal = a[sortByKey] instanceof Array ? a[sortByKey].join('') : a[sortByKey];
      const bSortVal = b[sortByKey] instanceof Array ? b[sortByKey].join('') : b[sortByKey];
      return sortOrders[sbkeyString][aSortVal] < sortOrders[sbkeyString][bSortVal] ? -1 : 1
    };
    const sortNormal = (a: Card, b: Card) => {
      return a[sortByKey] < b[sortByKey] ? -1 : 1
    };
    cards = cards.sort(Object.keys(sortOrders).includes(sbkeyString) ? sortSpecialOrder : sortNormal)
    if (!isAscendingSort) {
      cards = cards.reverse();
    }
  }
</script>

<a href="/newtab"><button>Go back</button></a>
<button onclick={clearCards}>Clear collection</button><br>
<label for="storageUsed">Browser storage used:</label>
<QuotaStatus progress={storageUsedProgress ? storageUsedProgress : 0} /><br>
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
  <TableView cards={cards} />
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
</style>