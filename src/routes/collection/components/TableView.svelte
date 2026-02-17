<script lang='ts'>
  let { cards = [] } = $props();
  import { capitalismState } from '$lib/capitalism/capitalismMode.svelte'
  import { Money } from '$lib/capitalism/money.svelte'
	import type Card from '$lib/models/card';

  async function sellCardFromTable(card: Card) {
    let confirm = true;
    if (card.price >= Money.SELL_WARN_THRESHOLD) {
      confirm = window.confirm(`Really sell ${card.name}? (value: $${card.price})`);
    }
    if (confirm) {
      const success = await Money.sellCard(card);
      if (success) {
        cards.splice(cards.indexOf(card), 1);
      }
    }
  }
</script>

<table>
  <thead>
  <tr>
    <th>Card Name</th>
    {#if capitalismState.capitalismMode}
      <th>Price</th>
      <th style="display: flex; align-items: center;">Actions</th>
    {/if}
  </tr>
</thead>
<tbody>
  {#each cards as c}
  <tr>
    <td>{c.name}</td>
    {#if capitalismState.capitalismMode}
      <td>${c.price}</td>
      <td><button onclick={async () => await sellCardFromTable(c)}>Sell</button></td>
    {/if}
  </tr>
  {/each}
</tbody>
</table>

<style>
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