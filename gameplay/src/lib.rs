use character::Character;
use wasm_bindgen::prelude::*;
use zkwasm_rust_sdk::{
    wasm_input,
    Merkle,
    require,
    wasm_dbg,
};
use once_cell::sync::Lazy;

extern crate num;
#[macro_use]
extern crate num_derive;

mod stdpack;
mod items;
mod skills;
mod character;

pub fn get_account(account: u32) -> [u64; 4] {
    Merkle::get(account as u64)
}

pub fn set_account(account: u32, data:&[u64; 4]) {
    Merkle::set(account as u64, data)
}

pub struct Status {
    pub wisdom: u32,
    pub attack: u32,
    pub luck: u32,
    pub charm: u32,
    pub family: u32,
    pub speed: u32,
    pub defence: u32,
    pub age: u32,
    pub currency: u32,
    pub context: Option<Event>
}

#[derive(Copy, Clone)]
pub struct Consequence {
    wisdom: i32,
    attack: i32,
    luck: i32,
    charm: i32,
    family: i32,
    speed: i32,
    defence: i32,
    age: i32,
    currency: i32,
}

impl Consequence {
    fn new_delta(
        wisdom: i32,
        attack: i32,
        luck: i32,
        charm: i32,
        family: i32,
        speed: i32,
        defence: i32,
        age: i32,
        currency: i32,
    ) -> Self {
        Consequence {
            wisdom,
            attack,
            luck,
            charm,
            family,
            speed,
            defence,
            age,
            currency,
        }
    }
}

#[derive(Clone)]
pub struct Choice {
    consequence: Consequence,
    description_id: u32,
    item_id: Option<usize>,
}

#[derive(Clone)]
pub struct Event {
    event_id: u32,
    choices: Vec<Choice>,
}

pub struct RuleEngine {
    leads: Vec<Vec<Event>>,
}

impl RuleEngine {
    fn select_leads(&self) -> usize {
        0
    }
    fn select_event(&self) -> usize {
        0
    }
    pub fn pick_event(&self, s: &Status, acttype: ActionType) -> &Event {
        &self.leads[self.select_leads()][self.select_event()]
    }
}

impl Status {
    pub fn new() -> Self {
        Status {
            wisdom: 10,
            attack: 10,
            luck: 10,
            charm: 10,
            family: 10,
            speed: 10,
            defence: 10,
            age: 12, // 1 year old (1 mth increments)
            currency: 10,
            context: None,
        }
    }
    pub fn act(&mut self, acttype: ActionType, rules: &RuleEngine) {
        let event = rules.pick_event(self, acttype);
        self.context = Some(event.clone());
    }

    pub fn choose(&mut self, choice_index: usize) -> Choice {
        let choice = self.context.as_ref().unwrap().choices[choice_index].clone();
        self.apply_consequence(choice.consequence);
        self.age += 1;
        choice
    }

    fn apply_consequence(&mut self, consq: Consequence) {
        self.wisdom = ((self.wisdom as i32) + consq.wisdom)as u32;
        self.attack = ((self.attack as i32) + consq.attack)as u32;
        self.luck = ((self.luck as i32) + consq.luck)as u32;
        self.charm = ((self.charm as i32) + consq.charm)as u32;
        self.family = ((self.family as i32) + consq.family)as u32;
        self.speed = ((self.speed as i32) + consq.speed)as u32;
        self.defence = ((self.defence as i32) + consq.defence)as u32;
        self.age = ((self.age as i32) + consq.age)as u32;
        self.currency = ((self.currency as i32) + consq.currency)as u32;
    }
}

static mut RG: Option<RuleEngine> = None;

//static STATUS: Status = Status::new();
static mut STATUS: Status = Status {
    wisdom: 10,
    attack: 10,
    luck: 10,
    charm: 10,
    family: 10,
    speed: 10,
    defence: 10,
    age: 10,
    currency: 10,
    context: None,
};

static mut CHARACTER: Lazy<Character> = Lazy::new(|| Character::new());

#[derive(Copy, Clone, FromPrimitive)]
pub enum ActionType {
    Working = 0,
    Exploring,
    Coasting,
}

#[wasm_bindgen]
pub fn init_rg() {
    unsafe {
        RG = Some (RuleEngine {
            leads: vec![
                stdpack::standard_pack()
            ]
        })
    }
}

#[wasm_bindgen]
pub fn get_wisdom() -> u32{
    unsafe {
        CHARACTER.get_status().wisdom
    }
}

#[wasm_bindgen]
pub fn get_attack() -> u32 {
    unsafe {
        CHARACTER.get_status().attack
    }
}

#[wasm_bindgen]
pub fn get_luck() -> u32 {
    unsafe {
        CHARACTER.get_status().luck
    }
}

#[wasm_bindgen]
pub fn get_charm() -> u32 {
    unsafe {
        CHARACTER.get_status().charm
    }
}

#[wasm_bindgen]
pub fn get_family() -> u32 {
    unsafe {
        CHARACTER.get_status().family
    }
}

#[wasm_bindgen]
pub fn get_speed() -> u32 {
    unsafe {
        CHARACTER.get_status().speed
    }
}

#[wasm_bindgen]
pub fn get_defence() -> u32 {
    unsafe {
        CHARACTER.get_status().defence
    }
}

#[wasm_bindgen]
pub fn get_age() -> u32 {
    unsafe {
        CHARACTER.get_status().age
    }
}

#[wasm_bindgen]
pub fn get_currency() -> u32 {
    unsafe {
        CHARACTER.get_status().currency
    }
}

#[wasm_bindgen]
pub fn get_life() -> u32 {
    unsafe {
        CHARACTER.get_life()
    }
}

#[wasm_bindgen]
pub fn get_choice(index: usize) -> u32 {
    unsafe {
        let event = CHARACTER.get_status().context.as_ref();
        event.unwrap().choices[index].description_id
    }
}

#[wasm_bindgen]
pub fn get_event() -> u32 {
    unsafe {
        let event = CHARACTER.get_status().context.as_ref();
        event.unwrap().event_id
    }
}

#[wasm_bindgen]
pub fn get_inventory() -> Vec<u32> {
    unsafe {
        CHARACTER.get_inventory().get_item_ids()
    }
}

#[wasm_bindgen]
pub fn action(at: u32) {
    let action_type = num::FromPrimitive::from_u32(at).unwrap();
    unsafe {
        CHARACTER.mutate_status().act(action_type, RG.as_ref().unwrap());
    }
}

#[wasm_bindgen]
pub fn choose(at: usize) {
    unsafe {
        let choice = CHARACTER.mutate_status().choose(at);
        CHARACTER.set_item_context(choice.item_id);
    }
}

#[wasm_bindgen]
pub fn buy_item(at: usize) {
    unsafe {
        CHARACTER.buy_item(at);
    }
}

#[wasm_bindgen]
pub fn sell_item(at: usize) {
    unsafe {
        CHARACTER.sell_item(at);
    }
}

#[wasm_bindgen]
pub fn get_item_context() -> u32 {
    unsafe {
        //Return the item_id of the item in context to be bought
        // handle None case for option

        let id = CHARACTER.get_item_context();
        
        if id.is_some() {
            id.unwrap() as u32
        } else {
            0
        }
    }
}

#[wasm_bindgen]
pub fn zkmain() {
}
