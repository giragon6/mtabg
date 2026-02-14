<script lang='ts'>
  import CardDisplay from './CardDisplay.svelte';
  let { cards = [] } = $props();

  let dragStartIndex = $state(-1)
  let dragEnterIndex = $state(-1)
  let dropIndex = $state(-1)

  function handleDragStart(index: number) {
    dragStartIndex = index;
  }

  function handleDragEnter(index: number) {
    dragEnterIndex = index;
  }

  function handleDragEnd() {
    dragStartIndex = -1;
  }

  function handleDrop() {
    if (dragStartIndex === dropIndex) return;
    const draggedItem = cards[dragStartIndex];
    cards.splice(dragStartIndex, 1);
    cards.splice(dropIndex, 0, draggedItem);
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault()
    //@ts-ignore
    const targRect = e.target.getBoundingClientRect();
    const targLeft = targRect.left;
    const targWidth = targRect.width;
    const xLoc = e.clientX - targLeft;
    if (xLoc < targWidth / 2) {
        dropIndex = dragEnterIndex;
    } else {
        dropIndex = dragEnterIndex + 1;
    }
  }
</script>

<div class="cards-container" ondrop={handleDrop} ondragover={handleDragOver} role="region">
    {#each cards as c, i}
        {#each { length: c.quantity > 0 ? c.quantity : 1 }}
          <CardDisplay 
              imageUri={c.imageUri} 
              flipImageUri={c.flipImageUri}
              name={c.name} 
              isFoil={c.foil.foilType == 'foil'}
              index={i} 
              handleDragStart={handleDragStart}
              handleDragEnd={handleDragEnd}
              handleDragEnter={handleDragEnter} />
          {/each}
    {/each}
</div>

<style>
  .cards-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin: 5%;
}
</style>