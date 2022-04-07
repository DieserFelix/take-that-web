<script lang="ts">
  import { ButtonContexts, ButtonTypes, IconNames, Player } from "../../lib";
  import { Button } from "../action";
  import { Icon, GameCard } from "../content";

  export let ended: boolean = false;
  export let position: string = "bottom";
  export let player: Player;
  export let kickHandler: () => void = undefined;
  export let extendHandler: (card: number) => void = undefined;
  export let twistHandler: (source: number, target: number) => void = undefined;
</script>

<div class={`place ${position}`}>
  {#if player.self}
    <Icon>{player.connected ? IconNames.wifi : IconNames.wifiOff}</Icon>
    {#if player.active}
      <strong>{player.name}</strong>
    {:else}
      {player.name}
    {/if}
  {/if}
  <div class="tile">
    {#if ended}
      <div class="results">
        <div class="position">
          <strong>{player.place}.</strong>
        </div>
        <div class="points">
          <strong>{player.points}</strong>
        </div>
        <div class="bonus">
          {player.bonus}
        </div>
        <div class="malus">
          {player.malus}
        </div>
      </div>
    {:else if player.self}
      {#each player.hand as card (`handCard-${card}`)}
        <GameCard
          label={`${card}`}
          faceDown={false}
          dragable={true}
          extendHandler={player.active ? extendHandler : undefined}
          twistHandler={player.active ? twistHandler : undefined}
        />
      {/each}
    {:else}
      <GameCard label={`${player.hand.length}`} faceDown={true} />
    {/if}
  </div>
  {#if !player.self}
    <Icon>{player.connected ? IconNames.wifi : IconNames.wifiOff}</Icon>
    {#if player.active}
      <strong>{player.name}</strong>
    {:else}
      {player.name}
    {/if}
    {#if kickHandler}
      <Button
        type={ButtonTypes.BUTTON}
        context={ButtonContexts.NEUTRAL}
        action={kickHandler}
      >
        <Icon>{IconNames.logout}</Icon>
      </Button>
    {/if}
  {/if}
</div>

<style>
  div.place {
    position: absolute;
    text-align: center;
    height: 255px;
  }

  div.place div.tile {
    width: 100%;
    height: 100%;
    text-align: center;
    white-space: nowrap;
    overflow: scroll;
  }

  div.bottom {
    left: 50%;
    bottom: 0;
    transform: translate(-50%, 25%);
    width: 75%;
  }

  div.topleft {
    left: 0;
    top: 0;
    transform: translate(0, -50%);
    width: 30%;
  }

  div.top {
    left: 50%;
    top: 0;
    transform: translate(-50%, -50%);
    width: 30%;
  }

  div.topright {
    right: 0;
    top: 0;
    transform: translate(0, -50%);
    width: 30%;
  }

  div.results {
    position: relative;
    width: 100%;
    display: block;
  }

  div.results div.position {
    position: absolute;
    left: 50%;
    top: 5px;
    text-align: center;
    transform: translate(-50%, 0);
    padding: 5px;
    width: 30px;
    border-radius: 30px;
    font-size: 25px;
    background-color: var(--bg-card);
    color: var(--color-card);
  }

  div.results div.points {
    position: absolute;
    left: 50%;
    top: 5px;
    text-align: center;
    transform: translate(50%, 0);
    padding: 5px;
    width: 30px;
    border-radius: 30px;
    font-size: 25px;
    background-color: var(--bg-card);
    color: var(--color-card);
  }

  div.results div.bonus {
    position: absolute;
    left: 50%;
    top: 50px;
    text-align: center;
    transform: translate(-50%, 0);
    padding: 5px;
    width: 25px;
    border-radius: 25px;
    font-size: 20px;
    background-color: var(--bg-card);
    color: green;
  }

  div.results div.malus {
    position: absolute;
    left: 50%;
    top: 50px;
    text-align: center;
    transform: translate(50%, 0);
    padding: 5px;
    width: 25px;
    border-radius: 25px;
    font-size: 20px;
    background-color: var(--bg-card);
    color: maroon;
  }
</style>
