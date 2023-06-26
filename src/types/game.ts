import * as Gameplay from "../js/gameplay";

export type WasmInstance = typeof Gameplay;

export enum ActionType {
  Working = 0,
  Exploring = 1,
  Coasting = 2,
}

export class State {
  wisdom: number;
  attack: number;
  luck: number;
  charm: number;
  family: number;
  speed: number;
  defence: number;
  age: number;
  currency: number;
  constructor(
    wisdom: number,
    attack: number,
    luck: number,
    charm: number,
    family: number,
    speed: number,
    defence: number,
    age: number,
    currency: number
  ) {
    this.wisdom = wisdom;
    this.attack = attack;
    this.luck = luck;
    this.charm = charm;
    this.family = family;
    this.speed = speed;
    this.defence = defence;
    this.age = age;
    this.currency = currency;
  }
}

export class Character {
  name: string;
  life: number;
  max_life: number;
  //skills: Skills
  state: State;
  constructor(name: string, life: number, max_life: number, state: State) {
    this.name = name;
    this.life = life;
    this.max_life = max_life;
    this.state = state;
  }

  public setState(state: State) {
    this.state = state;
    return this;
  }
}

export interface Item {
  item_id: number;
  buy_price: number;
  sell_value: number;
}

export interface Inventory {
  items: Item[];
}

export interface GameHistory {
  character: Character;
  event_id: number; // Event_id chosen by the player
  choice_id: number; // Choice_id chosen by the player
}
