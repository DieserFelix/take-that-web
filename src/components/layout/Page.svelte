<script lang="ts">
  import { Bar, Container, Content } from ".";

  export let title: string;
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<Bar title="Take That" />
<Container --flex-direction="column" --justify-content="center">
  <Content>
    <slot />
  </Content>
</Container>
<div class="back">
  <slot name="back" />
</div>

<style>
  div.back {
    position: absolute;
    left: 15px;
    top: 55px;
    color: white;
  }
</style>
