use wasm_bindgen::prelude::*;
use zkwasm_rust_sdk::{
    wasm_input,
    Merkle,
    require,
    wasm_dbg,
};
extern crate num;
#[macro_use]
extern crate num_derive;

pub fn get_account(account: u32) -> [u64; 4] {
    Merkle::get(account as u64)
}

pub fn set_account(account: u32, data:&[u64; 4]) {
    Merkle::set(account as u64, data)
}

struct Status {
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
struct Consequence {
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
struct Choice {
    consequence: Consequence,
    description_id: u32,
}

#[derive(Clone)]
struct Event {
    event_id: u32,
    choices: Vec<Choice>,
}

struct RuleEngine {
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
            age: 10,
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
        choice
    }

    fn apply_consequence(&mut self, consq: Consequence) {
        self.wisdom = ((self.wisdom as i32) + consq.wisdom)as u32;
        self.attack = ((self.wisdom as i32) + consq.attack)as u32;
        self.luck = ((self.wisdom as i32) + consq.luck)as u32;
        self.charm = ((self.wisdom as i32) + consq.charm)as u32;
        self.family = ((self.wisdom as i32) + consq.family)as u32;
        self.speed = ((self.wisdom as i32) + consq.speed)as u32;
        self.defence = ((self.wisdom as i32) + consq.defence)as u32;
        self.age = ((self.wisdom as i32) + consq.age)as u32;
        self.currency = ((self.wisdom as i32) + consq.currency)as u32;
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

#[derive(Copy, Clone, FromPrimitive)]
enum ActionType {
    Working = 0,
    Exploring,
    Coasting,
}

#[wasm_bindgen]
pub fn init_rg() {
    unsafe {
        RG = Some (RuleEngine {
            leads: vec![
                vec![
                    Event {
                        event_id: 0,
                        choices: vec![
                            Choice {
                                consequence:Consequence::new_delta(1,0,0,0,0,0,0,0,0),
                                description_id: 0,
                            }
                        ]
                    }
                ]
            ]
        })
    }
}

#[wasm_bindgen]
pub fn get_wisdom() -> u32{
    unsafe {
        STATUS.wisdom
    }
}

#[wasm_bindgen]
pub fn get_attack() -> u32 {
    unsafe {
        STATUS.attack
    }
}

#[wasm_bindgen]
pub fn get_luck() -> u32 {
    unsafe {
        STATUS.luck
    }
}

#[wasm_bindgen]
pub fn get_charm() -> u32 {
    unsafe {
        STATUS.charm
    }
}

#[wasm_bindgen]
pub fn get_family() -> u32 {
    unsafe {
        STATUS.family
    }
}

#[wasm_bindgen]
pub fn get_speed() -> u32 {
    unsafe {
        STATUS.speed
    }
}

#[wasm_bindgen]
pub fn get_defence() -> u32 {
    unsafe {
        STATUS.defence
    }
}

#[wasm_bindgen]
pub fn get_age() -> u32 {
    unsafe {
        STATUS.age
    }
}

#[wasm_bindgen]
pub fn get_currency() -> u32 {
    unsafe {
        STATUS.currency
    }
}

#[wasm_bindgen]
pub fn get_choice(index: usize) -> u32 {
    unsafe {
        let event = STATUS.context.as_ref();
        event.unwrap().choices[index].description_id
    }
}

#[wasm_bindgen]
pub fn get_event() -> u32 {
    unsafe {
        let event = STATUS.context.as_ref();
        event.unwrap().event_id
    }
}

#[wasm_bindgen]
pub fn action(at: u32) {
    let action_type = num::FromPrimitive::from_u32(at).unwrap();
    unsafe {
        STATUS.act(action_type, RG.as_ref().unwrap());
    }
}

#[wasm_bindgen]
pub fn choose(at: usize) {
    unsafe {
        STATUS.choose(at);
    }
}

#[wasm_bindgen]
pub fn zkmain() {
}
