use crate::{
    Consequence,
    Event, consequence, cost_consequence, character::Character
};

#[derive(Clone)]
pub struct Item {
    item_id: u32,
    consequence: Consequence, // Status effect of an item
    buy_price: u32,
    sell_value: u32,
}

impl Item {
    pub fn new(
        item_id: u32,
        consequence: Consequence,
        buy_price: u32,
        sell_value: u32,
    ) -> Self {
        Item {
            item_id,
            consequence,
            buy_price,
            sell_value,
        }
    }

    pub fn price(&self) -> u32 {
        self.buy_price
    }

    pub fn sell_value(&self) -> u32 {
        self.sell_value
    }

    pub fn consequence(&self) -> &Consequence {
        &self.consequence
    }
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

    pub fn add_item(&mut self, item_id: usize) {
        //find item with matching id
        
        //Should get item from data somewhere
        let item = Item {
            item_id: item_id as u32,
            consequence: consequence!(1, 0, 0, 0, 0, 0, 0, 0, 0, 0, None),
            buy_price: 1,
            sell_value: 1,
        };

        //add item to inventory
        self.items.push(item);
    }

    pub fn use_item(&mut self, item_id: u32) {
        
    }

    pub fn remove_item(&mut self, item_id: usize) -> Consequence {
        //if character inventory contains item with id == item_id
        //remove item from inventory

        //check if item is in inventory
        if self.items.iter().any(|item| item.item_id == item_id as u32) {

            //update currency
            let item = self.items.iter().find(|item| item.item_id == item_id as u32).unwrap().clone();
            //remove item from inventory
            self.items.retain(|item| item.item_id != item_id as u32);
            
            return cost_consequence!(-(item.sell_value as i32));
        }

        cost_consequence!(0)
    }

}

