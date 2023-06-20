use crate::{
    Consequence,
};

#[derive(Clone)]
pub struct Item {
    item_id: u32,
    consequence: Consequence, // Status effect of an item
}

// Inventory is a collection of items that can be used by a character and are dynamic
pub struct Inventory {
    items: Vec<Item>,
}

impl Inventory {
    pub fn new() -> Self {
        Inventory {
            items: Vec::new(),
        }
    }

    pub fn get_item_ids(&self) -> Vec<u32> {
        self.items.iter().map(|item| item.item_id).collect()
    }

    pub fn add_item(&mut self, item: Item) {
        self.items.push(item);
    }

    pub fn use_item(&mut self, item_id: u32) {
        
    }

    pub fn remove_item(&mut self, item_id: u32) {
        self.items.retain(|item| item.item_id != item_id);
    }
}

