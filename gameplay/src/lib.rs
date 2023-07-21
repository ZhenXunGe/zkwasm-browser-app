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
mod rule_engine;
mod utils;
use rule_engine::{RuleEngine};

pub fn get_account(account: u32) -> [u64; 4] {
    Merkle::get(account as u64)
}

pub fn set_account(account: u32, data:&[u64; 4]) {
    Merkle::set(account as u64, data)
}

#[derive(Copy, Clone)]
pub enum Command {
    Action = 0,
    Choice = 1,
    ItemDrop = 2,
    UseItem = 3,
    RemoveItem = 4,
}

static mut RG: Option<RuleEngine> = None;

static mut CHARACTER: Lazy<Character> = Lazy::new(|| Character::new());


#[derive(Copy, Clone)]
pub enum ActionType {
    Working = 0,
    Exploring,
    Coasting,
}

#[wasm_bindgen]
pub fn init_rg() {
    unsafe {
        RG = Some (RuleEngine::new(vec![stdpack::standard_pack()], 0))
    }
}

#[wasm_bindgen]
pub fn reset_character() {
    unsafe {
        CHARACTER = Lazy::new(|| Character::new());
    }
}

#[wasm_bindgen]
pub fn get_current_instance() -> u32 {
    unsafe {
        match RG {
            Some(ref rg) => rg.get_current_instance() as u32,
            None => 0,
        }
    }
}

#[wasm_bindgen]
pub fn update_instance(instance: u32) {
    unsafe {
        match RG {
            Some(ref mut rg) => rg.set_current_instance(instance as usize),
            None => (),
        }
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
pub fn action(action: u32) {

    let action_type = match action {
        0 => ActionType::Working,
        1 => ActionType::Exploring,
        2 => ActionType::Coasting,
        _ => panic!("Invalid action"),
    };
    
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
pub fn get_active_item_level(item_id: u32) -> u32 {
    unsafe {
        CHARACTER.get_active_item_level(item_id)
    }
}

#[wasm_bindgen]
pub fn get_inventory_item_level(item_id: u32) -> u32 {
    unsafe {
        CHARACTER.get_inventory_item_level(item_id)
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

fn unpack_u64_to_game_history(data: u64) -> (u32, u32) {
    let bytes = data.to_le_bytes();
    let player_input = u32::from_le_bytes([bytes[4], bytes[5], bytes[6], bytes[7]]);
    let value: u32 = u32::from_le_bytes([bytes[0], bytes[1], bytes[2], bytes[3]]);
    (player_input, value)
}

fn parse_command_value(raw_command: u32, value: u32) {
    
    match raw_command {
        0 => action(value as u32),
        1 => choose(value as usize),
        2 => choose_item(value as usize),
        3 => use_item(value as usize),
        4 => stop_use_item(value as usize),
        _ => panic!("Invalid command"),
    }
}
#[wasm_bindgen]
pub fn zkmain() {
    // unsafe {
    //     init_rg();
    //     reset_character();
    //     let input_len = wasm_input(1);
    //     let mut cursor = 0;
        
    //     while cursor < input_len {

    //         let encoded = wasm_input(0);
    //         //Convert encoded u64 into two u32s
    //         let (command, value) = unpack_u64_to_game_history(encoded);

    //         parse_command_value(command, value);
    //         cursor += 1;
    //     }
    // }
}
