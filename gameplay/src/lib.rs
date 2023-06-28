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
    pub life: u32,
    pub context: Option<Event>
}

#[derive(Copy, Clone, Debug)]
pub struct ItemDrop {
    item_id: u32,
}

#[derive(Clone)]
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
    life: i32,
    item_drop: Option<Vec<ItemDrop>>
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
        life: i32,
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
            life,
            item_drop: None,
        }
    }
    
    pub fn invert(&self) -> Self {
        Consequence {
            wisdom: -self.wisdom,
            attack: -self.attack,
            luck: -self.luck,
            charm: -self.charm,
            family: -self.family,
            speed: -self.speed,
            defence: -self.defence,
            age: -self.age,
            currency: -self.currency,
            life: -self.life,
            item_drop: None,
        }
    }

}

#[derive(Clone)]
pub struct Choice {
    consequence: Consequence,
    description_id: u32,
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
        let acttype = acttype as usize;
        &self.leads[self.select_leads()][acttype]
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
            life: 100,
            context: None,
        }
    }
    pub fn act(&mut self, acttype: ActionType, rules: &RuleEngine) {
        let event = rules.pick_event(self, acttype);
        self.context = Some(event.clone());
    }

    pub fn choose(&mut self, choice_index: usize) -> Choice {
        let choice = self.context.as_ref().unwrap().choices[choice_index].clone();
        self.apply_consequence(choice.clone().consequence);
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

        //Check for life overflow over 100 or under 0
        if (((self.life as i32) + consq.life ) as u32) > 100 {
            self.life = 100;
            return;
        } else if (((self.life as i32) + consq.life ) as i32) < 0 {
            self.life = 0;
            return;
        } 
        self.life = ((self.life as i32) + consq.life)as u32;
    }
}

static mut RG: Option<RuleEngine> = None;

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
pub fn reset_character() {
    unsafe {
        CHARACTER = Lazy::new(|| Character::new());
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
        CHARACTER.get_status().life
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
        CHARACTER.act(action_type, RG.as_ref().unwrap());
    }
}

#[wasm_bindgen]
pub fn choose(at: usize) {
    unsafe {
        CHARACTER.choose(at);
    }
}

#[wasm_bindgen]
pub fn choose_item(item_id: usize) {
    unsafe {
        CHARACTER.buy_item(item_id);
    }
}

#[wasm_bindgen]
pub fn sell_item(item_id: usize) {
    unsafe {
        CHARACTER.sell_item(item_id);
    }
}

#[wasm_bindgen]
pub fn use_item(item_id: usize) {
    unsafe {
        CHARACTER.use_item(item_id);
    }
}

#[wasm_bindgen]
pub fn stop_use_item(item_id: usize) {
    unsafe {
        CHARACTER.stop_use_item(item_id);
    }
}

#[wasm_bindgen]
pub fn get_active_items() -> Vec<u32> {
    unsafe {
        CHARACTER.get_active_item_ids()
    }
}

#[wasm_bindgen]
pub fn get_item_context_length() -> u32 {
    unsafe {
        let drops = CHARACTER.get_item_context();
        if drops.is_some() {
            drops.as_ref().unwrap().len() as u32
        } else {
            0
        }
    }
}
#[wasm_bindgen]
pub fn get_item_context_at_index(index: u32) -> u32 {
    unsafe {
        let drops = CHARACTER.get_item_context();
        if drops.is_some() {
            drops.as_ref().unwrap()[index as usize].item_id
        } else {
            0
        }
    }
}

#[wasm_bindgen]
pub fn get_item_context() -> Vec<u32> {
    unsafe {
        //Return the item_id(s) of the items in context to be bought
        
        let drops = CHARACTER.get_item_context();
        if drops.is_some() {
            
            drops.as_ref().unwrap().iter().map(|x| x.item_id).collect()
        } else {
            vec![]
        }
    }
}


#[wasm_bindgen]
pub fn zkmain() {
}
