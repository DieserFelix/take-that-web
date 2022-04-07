export const enum InputTypes {
  TEXT = "text",
  PASSWORD = "password",
}

export const enum ButtonTypes {
  BUTTON = "button",
  SUBMIT = "submit",
}

export const enum ButtonContexts {
  PRIMARY = "primary",
  TRANSPARENT = "transparent",
  NEUTRAL = "neutral",
  ANCHOR = "anchor",
}

export type State = {
  ingame: boolean;
  ended: boolean;
  deck_size: number;
  row: number[];
  players: { [key: number]: Player };
};

export type Player = {
  self: boolean;
  uuid: string;
  name: string;
  is_owner: boolean;
  active: boolean;
  connected: boolean;
  hand: number[];
  points: number;
  bonus: number;
  malus: number;
  bonus_stack: number[];
  malus_stack: number[];
  //UI attributes
  position?: string;
  place?: number;
};
