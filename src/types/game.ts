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
  life: number;
  constructor(
    wisdom: number,
    attack: number,
    luck: number,
    charm: number,
    family: number,
    speed: number,
    defence: number,
    age: number,
    currency: number,
    life: number
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
    this.life = life;
  }
}

export class Character {
  name: string;
  max_life: number;
  //skills: Skills
  state: State;
  inventory: Inventory;
  active_items: number[];
  constructor(
    name: string,
    max_life: number,
    state: State,
    inventory: Inventory,
    active_items: number[]
  ) {
    this.name = name;
    this.max_life = max_life;
    this.state = state;
    this.inventory = inventory;
    this.active_items = active_items;
  }

  public setState(state: State) {
    this.state = state;
    return this;
  }

  public syncWASM(wasm: WasmInstance) {
    let newState = new State(
      wasm.get_wisdom(),
      wasm.get_attack(),
      wasm.get_luck(),
      wasm.get_charm(),
      wasm.get_family(),
      wasm.get_speed(),
      wasm.get_defence(),
      wasm.get_age(),
      wasm.get_currency(),
      wasm.get_life()
    );
    console.log("syncing wasm", newState);
    this.setState(newState);
    let inventory = wasm.get_inventory();
    //console.log(wasm.get_item_context(), "item context");
    let active_items = wasm.get_active_items();
    this.inventory = { items: Array.from(inventory) };
    this.active_items = Array.from(active_items);
    return this;
  }

  public isAlive() {
    return this.state.life > 0;
  }
}

export interface Item {
  item_id: number;
  buy_price: number;
  sell_value: number;
}

export interface Inventory {
  items: number[];
}

export interface GameHistory {
  player_input: InputType;
  value: number;
}

export enum InputType {
  Action = 0,
  Choice = 1,
  ItemDrop = 2,
  ItemUse = 3,
  ItemRemove = 4,
}
