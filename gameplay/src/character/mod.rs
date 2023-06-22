use crate::items::{Inventory, Item};
use crate::{Status, consequence, Consequence};
use crate::{ActionType, RuleEngine};
use crate::skills::{Skill, Skills};

pub struct Character {
    inventory: Inventory,
    // Set potential items to purchase here, similar to setting potential event options in status
    item_context: Option<usize>,
    life: u32,
    max_life: u32,
    status: Status,
    skills: Skills,
}

impl Character {
    pub fn new() -> Self {
        Character {
            inventory: Inventory::new(),
            item_context: None, 
            life: 100,
            max_life: 100,
            status: Status::new(),
            skills: Skills::new(),
        }
    }

    pub fn act(&mut self, acttype: ActionType, rules: &RuleEngine) {
        let event = rules.pick_event(&self.status, acttype);
        self.status.act(acttype, &rules);
    }

    pub fn choose(&mut self, choice: usize) {
        self.status.choose(choice);
    }

    pub fn get_life(&self) -> u32 {
        self.life
    }

    pub fn get_status(&self) -> &Status {
        &self.status
    }

    pub fn get_inventory(&self) -> &Inventory {
        &self.inventory
    }

    pub fn get_skills(&self) -> &Skills {
        &self.skills
    }

    pub fn mutate_status(&mut self) -> &mut Status {
        &mut self.status
    }

    pub fn mutate_inventory(&mut self) -> &mut Inventory {
        &mut self.inventory
    }

    pub fn buy_item (&mut self, item_id: usize) {

        //check if character has enough money
        if self.item_context.is_some() && self.item_context.unwrap() == item_id {
            //TODO: Should get item from data somewhere, not create new one
            let item = Item::new(item_id as u32, consequence!(1, 0, 0, 0, 0, 0, 0, 0, 0), 1, 1);

            if self.status.currency >= item.price() {
                //update currency
                self.status.currency -= item.price();
                //add item to inventory
                self.inventory.add_item(item_id);
            }
            //reset context
            self.item_context = None;
        }
    }

    pub fn sell_item(&mut self, item_id: usize) {
        //check if character has item
        if self.inventory.get_item_ids().contains(&(item_id as u32)) {
            //update currency
            let cost = self.inventory.remove_item(item_id);
            //Get the item data and add the sell value to the character's currency
            self.status.apply_consequence(cost);
        }
    }

    pub fn add_skill(&mut self, new_skill: Skill) {
        self.skills.add_skill(new_skill);
    }

    pub fn set_life(&mut self, life: u32) {
        self.life = life;
    }

    pub fn set_status(&mut self, status: Status) {
        self.status = status;
    }

    pub fn set_inventory(&mut self, inventory: Inventory) {
        self.inventory = inventory;
    }

    // Get item to be potentially bought
    pub fn get_item_context(&self) -> &Option<usize> {
        &self.item_context
    }

    pub fn set_item_context(&mut self, context: Option<usize>) {
        self.item_context = context;
    }
}