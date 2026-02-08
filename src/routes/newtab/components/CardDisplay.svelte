<script lang="ts">
  import { HoverTilt } from 'hover-tilt';

  export let name: string;
  export let imageUri: string;
</script>

<HoverTilt tiltFactor={1.1} scaleFactor={1.1} style="border-radius: 4.5%;">
  <img src={imageUri} class="card" width=336 height=468 alt={name}>
</HoverTilt>

<style>
.card {
  border-radius: 4.5%;
}
</style>