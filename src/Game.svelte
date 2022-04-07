<script lang="ts">
  import { onMount } from "svelte";
  import { navigate, useParams } from "svelte-navigator";
  import Button from "./components/action/Button.svelte";
  import { Card, CardBody } from "./components/card";
  import { GameCard } from "./components/content";
  import { Form, Input } from "./components/form";
  import { Mid, Page, Place } from "./components/layout";
  import {
    ButtonContexts,
    ButtonTypes,
    InputTypes,
    State,
    useToken,
  } from "./lib";
  import store from "./lib/store";

  const params = useParams();
  let room: string = $params.room;
  let value: string = "";
  let name: string = "";

  let token: string;
  let state: State = {
    ingame: false,
    ended: false,
    deck_size: 79,
    row: [],
    players: {},
  };

  onMount(async () => {
    store.connect(room);
    store.subscribe(async (msg) => {
      msg = await JSON.parse(msg);
      switch (msg.event) {
        case "NO_SUCH_ROOM":
          console.log("no such room");
          navigate("/");
          break;
        case "GAME_STATE":
          state = msg.content;
          break;
        default:
          console.log(msg.event);
          break;
      }
    });
    token = await useToken();
    name = sessionStorage.getItem("name");
  });

  const join = () => {
    store.sendMessage({
      event: "join",
      data: {
        client: token,
        name: name,
      },
    });
  };

  const kick = (uuid: string) => {
    if (self.is_owner) {
      store.sendMessage({
        event: "kick",
        data: {
          client: token,
          uuid: uuid,
        },
      });
    }
  };

  const start = () => {
    if (self.is_owner) {
      store.sendMessage({
        event: "start",
        data: {
          client: token,
        },
      });
    }
  };

  const reset = () => {
    if (self.is_owner) {
      store.sendMessage({
        event: "reset",
        data: {
          client: token,
        },
      });
    }
  };

  const extend = (card: number) => {
    if (self.active) {
      store.sendMessage({
        event: "extend",
        data: {
          client: token,
          source: card,
        },
      });
    }
  };

  const twist = (source: number, target: number) => {
    if (self.active) {
      console.log(source, target);
      store.sendMessage({
        event: "twist",
        data: {
          client: token,
          source: source,
          target: target,
        },
      });
    }
  };

  const take = () => {
    if (self.active) {
      console.log("schluck");
      store.sendMessage({
        event: "take",
        data: {
          client: token,
        },
      });
    }
  };

  $: {
    if (token && name) {
      join();
    }
  }

  $: self = Object.values(state.players).find((player) => player.self);

  $: {
    let order: number[] = [];
    for (const [place, player] of Object.entries(state.players)) {
      if (player.self) {
        player.position = "bottom";
        for (
          let i = +place + 1;
          i < +place + Object.values(state.players).length;
          i++
        ) {
          order.push(i % Object.values(state.players).length);
        }
        break;
      }
    }
    let positions: string[];
    if (Object.values(state.players).length == 2) {
      positions = ["top"];
    } else if (Object.values(state.players).length == 3) {
      positions = ["topright", "topleft"];
    } else if (Object.values(state.players).length == 4) {
      positions = ["topright", "top", "topleft"];
    }
    for (const place of order) {
      state.players[place].position = positions.pop();
    }
  }

  $: {
    if (state.ended) {
      const players = Object.values(state.players);
      players.sort((p, q) => p.points - q.points);
      players.forEach((player, i) => {
        player.place = i + 1;
      });
    }
  }
</script>

<Page title="Take That">
  {#if !name}
    <Card>
      <CardBody>
        <Form
          submitHandler={() => {
            sessionStorage.setItem("name", value);
            name = value;
          }}
        >
          <Input
            id="name"
            label="What do you want to call yourself?"
            type={InputTypes.TEXT}
            bind:value
          />
        </Form>
      </CardBody>
    </Card>
  {:else}
    <Mid --text-align={state.ingame && !state.ended ? "left" : "center"}>
      {#if !state.ingame}
        {#if self && self.is_owner}
          <Button
            type={ButtonTypes.BUTTON}
            context={ButtonContexts.NEUTRAL}
            action={start}>Start game</Button
          >
        {:else}
          Wait for owner to start game
        {/if}
      {:else if !state.ended}
        <GameCard
          label={`${state.deck_size}`}
          faceDown={true}
          clickHandler={take}
        />
        {#each state.row as card (`rowCard-${card}`)}
          <GameCard label={`${card}`} faceDown={false} />
        {/each}
      {:else}
        Game ended!<br />
        <Button
          type={ButtonTypes.BUTTON}
          context={ButtonContexts.NEUTRAL}
          action={reset}
        >
          Reset room
        </Button>
      {/if}
    </Mid>
    {#each Object.values(state.players) as player (`player-${player.uuid}`)}
      <Place
        ended={state.ended}
        position={player.position}
        player={player}
        extendHandler={extend}
        twistHandler={twist}
        kickHandler={self.is_owner
          ? () => {
              kick(player.uuid);
            }
          : undefined}
      />
    {/each}
  {/if}
</Page>
