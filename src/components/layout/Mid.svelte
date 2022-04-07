<script lang="ts">
  $: cssVariables = Object.entries($$props)
    .filter(([key]) => key.startsWith("--"))
    .reduce((css, [key, value]) => `${css}${key}: ${value};`, "");
</script>

<div id="mid" class="mid" style={cssVariables}>
  <slot />
</div>

<style>
  div.mid {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100vw;
    height: 270px;
    text-align: var(--text-align);
    white-space: nowrap;
    overflow: scroll;
  }
</style>
