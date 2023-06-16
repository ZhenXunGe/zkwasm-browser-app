use wasm_bindgen::prelude::*;
use zkwasm_rust_sdk::{
    wasm_input,
    Merkle,
    require,
    wasm_dbg,
};
use std::sync::Mutex;
extern crate num;
#[macro_use]
extern crate num_derive;
#[macro_use]
extern crate lazy_static;

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
    pub context: Option<Vec<Choice>>
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

#[derive(Copy, Clone)]
struct Choice {
    consequence: Consequence,
    description_id: u32,
    ratio: u32,
}

struct RuleEngine {
}

impl RuleEngine {
    pub fn pick_rule(&self, s: &Status, acttype: ActionType) -> Vec<Choice> {
        vec![
            Choice {
                consequence:Consequence::new_delta(0,0,0,0,0,0,0,0,0),
                description_id: 0,
                ratio: 20,
            }
        ]
    }
}

// calculate status after applying consequence
fn cal_cons(status: u32, consq: i32) -> u32 {
    u32::try_from(i32::try_from(status).unwrap() + consq).unwrap()
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
    pub fn act(&mut self, acttype: ActionType, rules: &RuleEngine) -> Vec<Choice> {
        let choices = rules.pick_rule(self, acttype);
        self.context = Some(choices.clone());
        choices
    }

    pub fn choose(&mut self, choice_index: usize) -> Choice {
        let choice = self.context.as_ref().unwrap()[choice_index];
        self.apply_consequence(choice.consequence);
        choice
    }

    // calculate new status value
    fn apply_consequence(&mut self, consq: Consequence) {
        self.wisdom = cal_cons(self.wisdom, consq.wisdom);
        self.attack = cal_cons(self.attack, consq.attack);
        self.luck = cal_cons(self.luck, consq.luck);
        self.charm = cal_cons(self.charm, consq.charm);
        self.family = cal_cons(self.family, consq.family);
        self.speed = cal_cons(self.speed, consq.speed);
        self.defence = cal_cons(self.defence, consq.defence);
        self.age = cal_cons(self.age, consq.age);
        self.currency = cal_cons(self.currency, consq.currency);
    }
}

//static STATUS: Status = Status::new();
lazy_static! {
    static ref STATUS: Mutex<Status> = {
        let status = Status::new();
        Mutex::new(status)
    };
}

#[derive(Copy, Clone, FromPrimitive)]
enum ActionType {
    Working = 0,
    Exploring,
    Coasting,
}

/*
#[wasm_bindgen]
pub fn get_status() -> Status {
    let status = Status::new();
    status
}
*/

#[wasm_bindgen]
pub fn get_wisdom() -> u32 {
    STATUS.lock().unwrap().wisdom
}


#[wasm_bindgen]
pub fn get_choices() -> Vec<u32> {
    let binding = STATUS.lock().unwrap();
    let choices = binding.context.as_ref();
    choices.map_or(vec![], |x| {
        x.iter().map(|x| {
            x.description_id
        }).collect::<Vec<u32>>()
    })
}

#[wasm_bindgen]
pub fn action(at: u32) {
    let action_type = num::FromPrimitive::from_u32(at).unwrap();
    let rule_engine = RuleEngine {};
    let _choices = STATUS.lock().unwrap().act(action_type, &rule_engine);
}

#[wasm_bindgen]
pub fn choose(at: usize) {
    STATUS.lock().unwrap().choose(at);
}

#[wasm_bindgen]
pub fn zkmain() {
}
