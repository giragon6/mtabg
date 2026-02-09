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
</script>

<div 
  draggable="true" 
  ondragstart={() => dragStart(index)} 
  ondragenter={() => dragEnter(index)} 
  ondragend={handleDragEnd} 
  role="region">
  <HoverTilt tiltFactor={1.1} scaleFactor={1.1} style="border-radius: 4.5%;">
    <div class:foil={isFoil}>
      <img src={imageUri} class="card" width=336 height=468 alt={name}>
    </div>
  </HoverTilt>
</div>

<style>
.card {
  border-radius: 4.5%;
}

.foil:before {
  margin: 4.5%;
  content: "";
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(90deg, rgba(154, 18, 179, 0.3), rgba(44, 130, 201, 0.3), rgba(42, 187, 155, 0.3), rgba(233, 212, 96, 0.3), rgba(240, 52, 52, 0.3), rgba(154, 18, 179, 0.3));  
  transition: all .3s linear;
}

</style>