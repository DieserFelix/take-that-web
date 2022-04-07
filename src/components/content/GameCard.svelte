<script lang="ts">
  import { afterUpdate } from "svelte";

  export let label: string = "";
  export let faceDown: boolean = true;
  export let dragable: boolean = false;
  export let extendHandler: (card: number) => void = undefined;
  export let twistHandler: (source: number, target: number) => void = undefined;
  export let clickHandler: () => void = undefined;

  let cardRef: HTMLDivElement = undefined;
  let followMouse: boolean = false;
  let twistTarget: Element = undefined;

  const twistable = (target: string) => {
    return target.split("").reverse().join("") === label;
  };

  const canExtend = () => {
    const cards = document.getElementsByClassName("card faceUp fixed");
    if (!cards.length) {
      return true;
    }
    const endOfRow = cards[cards.length - 1].getAttribute("data");
    console.log(endOfRow);
    if (+label >= +endOfRow - 10 && +label <= +endOfRow + 10) {
      return true;
    }
    return false;
  };

  const canTwist = () => {
    const cards = document.getElementsByClassName("card faceUp fixed");
    if (!cards.length) {
      return false;
    }
    for (const card of cards) {
      if (twistable(card.getAttribute("data"))) {
        return true;
      }
    }
    const endOfRow = cards[cards.length - 1].getAttribute("data");
    if (+label >= +endOfRow - 10 && +label <= +endOfRow + 10) {
      return true;
    }
    return false;
  };

  const intersects = (a: Element, b: Element) => {
    const dimensionsA = a.getBoundingClientRect();
    const dimensionsB = b.getBoundingClientRect();
    if (
      dimensionsA.top + dimensionsA.height >= dimensionsB.top &&
      dimensionsA.left + dimensionsA.width >= dimensionsB.left &&
      dimensionsA.bottom - dimensionsA.height <= dimensionsB.bottom &&
      dimensionsA.right - dimensionsA.width <= dimensionsB.right
    ) {
      return true;
    }
    return false;
  };

  afterUpdate(() => {
    if (
      dragable &&
      extendHandler &&
      twistHandler &&
      (canExtend() || canTwist())
    ) {
      cardRef?.style.setProperty("border-color", "var(--border-secondary)");
    } else {
      cardRef?.style.setProperty("border-color", "var(--border-main)");
    }
  });
</script>

<div
  bind:this={cardRef}
  data={label}
  class={`card ${faceDown ? "faceDown" : "faceUp"} ${
    dragable ? "draggable" : "fixed"
  }`}
  on:click={clickHandler}
  on:mousedown={() => {
    followMouse = true;
  }}
  on:mouseup={(event) => {
    if (dragable) {
      followMouse = false;
      const div = event.currentTarget;
      const mid = document.getElementById("mid");
      mid.style.setProperty("background-color", "transparent");
      if (twistTarget) {
        twistHandler(+label, +twistTarget.getAttribute("data"));
      } else {
        if (intersects(div, mid)) {
          extendHandler(+label);
        }
      }
      div.style.setProperty("position", "relative");
      div.style.setProperty("left", "");
      div.style.setProperty("top", "");
      div.style.setProperty("display", "inline-block");
      div.style.setProperty("z-index", "9999");
    }
  }}
  on:mousemove={(event) => {
    if (dragable && extendHandler && twistHandler && followMouse) {
      const div = event.currentTarget;
      const parent = div.parentElement;
      const { width, height } = div.getBoundingClientRect();
      const { x: parentX, y: parentY } = parent.getBoundingClientRect();
      div.style.setProperty("position", "absolute");
      div.style.setProperty("left", `${event.clientX - width / 2 - parentX}px`);
      div.style.setProperty("top", `${event.clientY - height / 2 - parentY}px`);
      div.style.setProperty("display", "block");
      div.style.setProperty("z-index", "10000");
      const cards = document.getElementsByClassName("card faceUp fixed");
      for (const card of cards) {
        if (intersects(div, card) && twistable(card.getAttribute("data"))) {
          twistTarget = card;
          //@ts-ignore-line
          twistTarget.style.setProperty(
            "border-color",
            "var(--border-secondary)",
          );
        }
      }
      if (twistTarget && !intersects(div, twistTarget)) {
        //@ts-ignore-line
        twistTarget.style.setProperty("border-color", "var(--border-main)");
        twistTarget = undefined;
      }
      const mid = document.getElementById("mid");
      if (intersects(div, mid)) {
        mid.style.setProperty("background-color", "rgba(255, 255, 255, 0.5");
      } else {
        mid.style.setProperty("background-color", "transparent");
      }
    }
  }}
  on:mouseover={() => {
    if (dragable && extendHandler && twistHandler) {
      const cards = document.getElementsByClassName("card faceUp fixed");
      for (const card of cards) {
        if (twistable(card.getAttribute("data"))) {
          //@ts-ignore-line
          card.style.setProperty("color", "var(--bg-secondary)");
        }
      }
    }
  }}
  on:focus={() => {}}
  on:mouseout={() => {
    if (dragable && extendHandler && twistHandler) {
      const cards = document.getElementsByClassName("card faceUp fixed");
      for (const card of cards) {
        //@ts-ignore-line
        card.style.setProperty("color", "");
      }
    }
  }}
  on:blur={() => {}}
>
  <div class="label">
    {label}
  </div>
</div>

<style>
  div.card {
    position: relative;
    width: 160px;
    height: 250px;
    border-radius: 25px;
    border: 1px solid var(--border-main);
    margin: 0 5px;
    z-index: 9999;
    display: inline-block;
  }

  div.faceDown {
    background-color: rgb(134, 0, 0);
  }

  div.faceDown div.label {
    position: absolute;
    left: 50%;
    bottom: 5px;
    text-align: center;
    transform: translate(-50%, 0);
    padding: 5px;
    width: 25px;
    border-radius: 25px;
    font-size: 20px;
    background-color: var(--bg-card);
  }

  div.faceUp {
    background-color: var(--bg-card);
  }

  div.faceUp div.label {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 5px;
    width: 50px;
    text-align: center;
    border-radius: 50px;
    font-size: 32px;
  }
</style>
