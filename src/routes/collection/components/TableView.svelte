<script lang='ts'>
  import { capitalismState } from '$lib/capitalism/capitalismMode.svelte'
  import { Money } from '$lib/capitalism/money.svelte'
	import type Card from '$lib/models/card';
	import { toFullName } from '$lib/types/boosters';
	import { colorsToStyle, FoilType } from '$lib/types/cards';
  
  let { cards = [] } = $props();
  let loading = $state(false);
  let dummy = $state(0)

  async function sellCardFromTable(card: Card) {
    let confirm = true;
    if (card.price >= Money.SELL_WARN_THRESHOLD) {
      confirm = window.confirm(`Really sell ${card.name}? (value: $${card.price})`);
    }
    if (confirm) {
      card.quantity -= 1;
      const success = await Money.sellCard(card);
      if (success !== null) {
        if (card.quantity === 0) {
          cards.splice(cards.indexOf(card), 1);
        }
      }
      
    }
  }
</script>

<table>
  <thead>
  <tr>
    <th>Qty</th>
    <th>Card Name</th>
    <th>Set</th>
    <th>Effect</th>
    {#if capitalismState.capitalismMode}
      <th>Price</th>
      <th style="display: flex; align-items: center;">Actions</th>
    {/if}
  </tr>
</thead>
<tbody>
  {#each cards as c}
  <tr style="color: {c.foil == FoilType.none ? "#000000" : "#100cf9"};"> 
    <td>{c.quantity}</td>
    <td style="background-color: {colorsToStyle(c.colors)};">{c.name}</td>
    <td>{toFullName(c.set)}</td>
    <td>{c.foil ? c.foil : "None"}</td>
    {#if capitalismState.capitalismMode} 
      <td>${Number(c.price).toFixed(2)}</td>
      <td><button onclick={async () => await sellCardFromTable(c)}>Sell</button></td>
    {/if}
  </tr>
  {/each}
</tbody>
</table>

<style>
  table {
    margin: 5%;
    width: 80%;
  }

  tr {
    background-color: #e3e3e3;
  }

  tr:nth-child(even) {
    background-color: #c7c8c9;
  }

  tr:nth-child(even) > td > button {
    background-color: #c7c8c9;
  }

  button {
    width: 100%;
    height: 100%;
    border: none;
    background-color: #e3e3e3;
  }

  button:hover, tr:nth-child(even) > td > button:hover {
    background-color: #9e9e9e;
  }
</style>