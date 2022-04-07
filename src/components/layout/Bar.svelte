<script lang="ts">
  import { navigate } from "svelte-navigator";

  import { ButtonContexts, ButtonTypes } from "../../lib";
  import { Button } from "../action";

  export let title: string;
</script>

<div class="bar">
  <div class="controls"><slot /></div>
  <div class="title">
    <Button
      type={ButtonTypes.BUTTON}
      context={ButtonContexts.NEUTRAL}
      action={() => navigate("/")}>{title}</Button
    >
  </div>
</div>

<style>
  div.bar {
    width: 100%;
    height: 50px;
    position: relative;
    background: var(--bg-secondary);
    z-index: 999;
  }

  div.title {
    position: absolute;
    right: 15px;
    color: white;
    font-size: 16pt;
    line-height: 50px;
  }

  div.controls {
    position: absolute;
    left: 15px;
    line-height: 50px;
    color: white;
  }
</style>
