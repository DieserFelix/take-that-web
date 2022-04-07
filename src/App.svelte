<script lang="ts">
  import { Route, Router } from "svelte-navigator";

  import Landing from "./Landing.svelte";
  import Game from "./Game.svelte";
</script>

<Router>
  <Route path={"/"}>
    <Landing />
  </Route>
  <Route path={"/rooms/:room"}>
    <Game />
  </Route>
</Router>
