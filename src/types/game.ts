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
  savings: number;
  life: number;
  max_life: number;
  //skills: Skills
  state: State;
  constructor(
    name: string,
    savings: number,
    life: number,
    max_life: number,
    state: State
  ) {
    this.name = name;
    this.savings = savings;
    this.life = life;
    this.max_life = max_life;
    this.state = state;
  }
}
