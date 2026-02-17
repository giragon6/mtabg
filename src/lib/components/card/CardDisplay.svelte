<script lang="ts">
  import { HoverTilt } from 'hover-tilt';

  export let name: string;
  export let imageUri: string;
  export let isFoil: boolean;
  export let index: number;

  export let handleDragStart: any;
  export let handleDragEnd: any;
  export let handleDragEnter: any;
  let isDragged = false;

  export let flipImageUri: string | null = null;
  let isFlippable = flipImageUri !== null;

  function dragStart(index: number) {
    isDragged = true;
    handleDragStart(index);
  }

  function dragEnter(index: number) {
    handleDragEnter(index);
  }

  function dragEnd() {
    isDragged = false;
    handleDragEnd();
  }

  function tryFlip() {
    if (!flipImageUri) { return; }

  }

  //TODO: fix glare appearing behind 2-sided cards as they flip
</script>

<button 
  onclick={tryFlip}
  draggable="true" 
  ondragstart={() => dragStart(index)} 
  ondragenter={() => dragEnter(index)} 
  ondragend={handleDragEnd}
  class:flippable={isFlippable} >
  <HoverTilt 
    tiltFactor={1.1}
    scaleFactor={1.1} 
    style="border-radius: 4.5%; visibility: visible; z-index: 1;"
    class="glare" >
    <div class:foil={isFoil} class="card-faces-container">
      <img src={imageUri} class="card" class:card-front={isFlippable} width=336 height=468 alt={name}>
      {#if flipImageUri}
        <img src={flipImageUri} class="card" class:card-back={isFlippable} width="336" height="468" alt={name}>
      {/if}
    </div>
  </HoverTilt>
</button>

<style>
button {
  visibility: hidden;
}

.flippable:hover .card-front {
  transition: transform 0.8s;
  transform-style: preserve-3d;
  transform: rotateY(180deg);
}

.flippable:hover .foil:before {
  transition: transform 0.8s;
  transform-style: preserve-3d;
  transform: none;
}

.flippable:hover .card-back {
  transition: transform 0.8s;
  transform-style: preserve-3d;
  transform: none;
}

.card-faces-container {
  display: grid;
  grid-template-columns: 1fr;
}

.card {
  border-radius: 4.5%;
}

.card-front, .card-back {
  left: 0%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  grid-row-start: 1;
  grid-column-start: 1;
  z-index: -1;
}


.card-back {
  transform: rotateY(180deg);
}

.foil:before {
  border-radius: 4.5%;
  content: "";
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(90deg, rgba(154, 18, 179, 0.3), rgba(44, 130, 201, 0.3), rgba(42, 187, 155, 0.3), rgba(233, 212, 96, 0.3), rgba(240, 52, 52, 0.3), rgba(154, 18, 179, 0.3));  
  transition: all .3s linear;
  z-index: 1;
}

</style>