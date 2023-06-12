use wasm_bindgen::prelude::*;
use zkwasm_rust_sdk::{
    wasm_input,
    Merkle,
    require,
    wasm_dbg,
};

pub fn get_account(account: u32) -> [u64; 4] {
    Merkle::get(account as u64)
}

pub fn set_account(account: u32, data:&[u64; 4]) {
    Merkle::set(account as u64, data)
}

struct Status {
    wisdom: u32,
    attack: u32,
    luck: u32,
    charm: u32,
    family: u32,
    speed: u32,
    defence: u32,
    age: u32,
    currency: u32,
    context: Option<Vec<Choice>>
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

#[derive(Copy, Clone)]
struct Choice {
    consequence: Consequence,
    description: String,
    ratio: u32,
}

struct RuleEngine {
}

impl RuleEngine {
    pub fn pick_rule(&self, s: &Status, acttype: ActionType) -> Vec<Choice> {
        todo!()
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
    pub fn act(&self, acttype: ActionType, rules: &RuleEngine) -> Vec<Choice> {
        let choices = rules.pick_rule(self, acttype);
        choices
    }

    pub fn choose(&self, choice_index: usize) -> Choice {
        let choice = self.context.unwrap()[choice_index];
        self.apply_consequence(choice.consequence);
        choice
    }

    pub fn apply_consequence(&self, consq: Consequence) {
        todo!()
    }
}

#[derive(Copy, Clone)]
enum ActionType {
    Working,
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
pub fn zkmain() {
    let status = Status::new();
}
