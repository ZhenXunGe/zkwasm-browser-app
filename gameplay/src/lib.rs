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

#[derive(Clone)]
struct Choice {
    consequence: Consequence,
    description: String,
    ratio: u32,
}

struct RuleEngine {
}

impl RuleEngine {
    pub fn pick_rule(&self, s: &Status, acttype: ActionType) -> Vec<Choice> {
        vec![
            Choice {
                consequence:Consequence::new_delta(0,0,0,0,0,0,0,0,0),
                description:"about to inc your wisdom".to_string(),
                ratio: 20,
            }
        ]
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
    pub fn act(&mut self, acttype: ActionType, rules: &RuleEngine) -> Vec<Choice> {
        let choices = rules.pick_rule(self, acttype);
        self.context = Some(choices.clone());
        choices
    }

    pub fn choose(&mut self, choice_index: usize) -> Choice {
        let choice = self.context.as_ref().unwrap()[choice_index].clone();
        self.apply_consequence(choice.consequence);
        choice
    }

    fn apply_consequence(&mut self, consq: Consequence) {
        self.wisdom += 1;
    }
}

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
pub fn get_wisdom() -> u32 {
    unsafe {
        STATUS.wisdom
    }
}

#[wasm_bindgen]
pub fn step() {
    let rule_engine = RuleEngine {};
    unsafe {
        let choices = STATUS.act(ActionType::Exploring, &rule_engine);
        STATUS.choose(0);
    }
}

#[wasm_bindgen]
pub fn zkmain() {
}
