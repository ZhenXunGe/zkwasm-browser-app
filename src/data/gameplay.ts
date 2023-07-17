import clothes1 from "../assets/equipment/items/clothes1.png";
import clothes2 from "../assets/equipment/items/clothes2.png";
import deco1 from "../assets/equipment/items/deco1.png";
import deco2 from "../assets/equipment/items/deco2.png";
import hat1 from "../assets/equipment/items/hat1.png";
import hat2 from "../assets/equipment/items/hat2.png";
import shield1 from "../assets/equipment/items/shield1.png";
import shield2 from "../assets/equipment/items/shield2.png";
import shoes1 from "../assets/equipment/items/shoes1.png";
import shoes2 from "../assets/equipment/items/shoes2.png";
import weapon1 from "../assets/equipment/items/weapon1.png";
import weapon2 from "../assets/equipment/items/weapon2.png";

import { EvilEventImage, GodEventImage, AttackEventImage } from "./images";

const choiceMapping = [
  {
    name: "Increase Wisdom",
    image: GodEventImage,
  },
  {
    name: "Increase Money",
    image: GodEventImage,
  },
  {
    name: "Item drop example",
    image: AttackEventImage,
  },
  {
    name: "Lower Wisdom",
    image: EvilEventImage,
  },
  {
    name: "Lower Money (Cost)",
    image: EvilEventImage,
  },
  {
    name: "Decrease HP",
    image: AttackEventImage,
  },
  {
    name: "Increase HP",
    image: GodEventImage,
  },
];

export const eventsTable = [
  {
    description: "Event 1",
    choices: [choiceMapping[0], choiceMapping[1], choiceMapping[2]],
  },
  {
    description: "Event 2",
    choices: [choiceMapping[3], choiceMapping[4], choiceMapping[2]],
  },
  {
    description: "Event 3",
    choices: [choiceMapping[5], choiceMapping[5], choiceMapping[2]],
  },
];

export const itemsTable = [
  {
    name: "Clothes 1",
    description: "YYYYY",
    imageSource: clothes1,
  },
  {
    name: "Clothes 2",
    description: "YYYYY",
    imageSource: clothes2,
  },
  {
    name: "Deco 1",
    description: "YYYYY",
    imageSource: deco1,
  },
  {
    name: "Deco 2",
    description: "YYYYY",
    imageSource: deco2,
  },
  {
    name: "Hat 1",
    description: "YYYYY",
    imageSource: hat1,
  },
  {
    name: "Hat 2",
    description: "YYYYY",
    imageSource: hat2,
  },
  {
    name: "Shield 1",
    description: "YYYYY",
    imageSource: shield1,
  },
  {
    name: "Shield 2",
    description: "YYYYY",
    imageSource: shield2,
  },
  {
    name: "Shoes 1",
    description: "YYYYY",
    imageSource: shoes1,
  },
  {
    name: "Shoes 2",
    description: "YYYYY",
    imageSource: shoes2,
  },
  {
    name: "Weapon 1",
    description: "YYYYY",
    imageSource: weapon1,
  },
  {
    name: "Weapon 2",
    description: "YYYYY",
    imageSource: weapon2,
  },
];

export const skillsTable = [
  {
    name: "XXXXX",
    description: "YYYYY",
  },
];
