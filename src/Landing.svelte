<script lang="ts">
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator";
  import { Button } from "./components/action";
  import { Page } from "./components/layout";
  import { useToken } from "./lib";
  import { ButtonContexts, ButtonTypes } from "./lib/types";

  onMount(() => useToken());
</script>

<Page title="Take That">
  <Button
    context={ButtonContexts.PRIMARY}
    type={ButtonTypes.BUTTON}
    action={() => {
      fetch("http://localhost:8000/api/rooms/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }).then(async (response) => {
        const room = await response.json();
        navigate(`/rooms/${room}`);
      });
    }}
  >
    Open room
  </Button>
</Page>
