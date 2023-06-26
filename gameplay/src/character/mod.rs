use crate::items::{Inventory, Item};
use crate::{Status, consequence, Consequence, ItemDrop, drop};
use crate::{ActionType, RuleEngine};
use crate::skills::{Skill, Skills};

pub struct Character {
    inventory: Inventory,
    // Set potential items to purchase here, similar to setting potential event options in status
    item_context: Option<Vec<ItemDrop>>,
    max_life: u32,
    status: Status,
    skills: Skills,
}

impl Character {
    pub fn new() -> Self {
        Character {
            inventory: Inventory::new(),
            item_context: None, 
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

        //Apply the consequence of the choice to the character
        let outcome = self.status.choose(choice);

        //Add the drop to the inventory
        let drops = outcome.consequence.item_drop;
        self.set_item_context(drops)
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

    fn mutate_status(&mut self) -> &mut Status {
        &mut self.status
    }

    fn mutate_inventory(&mut self) -> &mut Inventory {
        &mut self.inventory
    }

    pub fn buy_item (&mut self, item_id: usize) {

        //Check if item is in context from previous choice

        if self.item_context.is_some() {

            //Check if item is in context from previous choice
            let drops = self.item_context.as_ref().unwrap().clone();

             // check if any element satisfies the condition
            if drops.iter().any(|drop| drop.item_id == item_id as u32) {
                self.mutate_inventory().add_item(item_id);
            }

            // Remove the item context so the player cannot buy the same item/other items from the same context
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

    pub fn set_status(&mut self, status: Status) {
        self.status = status;
    }

    pub fn set_inventory(&mut self, inventory: Inventory) {
        self.inventory = inventory;
    }

    // Get item to be potentially bought
    pub fn get_item_context(&self) -> &Option<Vec<ItemDrop>> {
        &self.item_context
    }

    pub fn set_item_context(&mut self, context: Option<Vec<ItemDrop>>) {
        self.item_context = context;
    }
}