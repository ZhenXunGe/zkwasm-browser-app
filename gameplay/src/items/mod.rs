use crate::character::status::Consequence;
use crate::{cost_consequence, consequence};


#[derive(Clone)]
pub enum ItemClass {
    Weapon,
    Armor,
    Consumable,
    Accessory,
}


#[derive(Clone)]
pub struct Item {
    item_id: u32,
    consequence: Consequence, // Status effect of an item
    buy_price: u32,
    sell_value: u32,
    level: u32,
    class: ItemClass,
}

impl Item {
    pub fn new(
        item_id: u32,
        consequence: Consequence,
        buy_price: u32,
        sell_value: u32,
        level: u32,
        class: ItemClass,
    ) -> Self {
        Item {
            item_id,
            consequence,
            buy_price,
            sell_value,
            level,
            class,
        }
    }

    pub fn id(&self) -> u32 {
        self.item_id
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

    pub fn level(&self) -> u32 {
        self.level
    }

    pub fn upgrade(&mut self) {
        if self.level < 5 {
            self.level += 1;
        }
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

    pub fn get_item_from_id(&self, item_id: u32) -> Option<&Item> {
        self.items.iter().find(|item| item.item_id == item_id)
    }

    pub fn add_item(&mut self, item: Item) {
        //find item with matching id
        //add item to inventory
        self.items.push(item);
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

    pub fn upgrade_item(&mut self, item_id: usize) -> Consequence {
        //check if item is in inventory
        if self.items.iter().any(|item| item.item_id == item_id as u32) {
            //upgrade item
            let item = self.items.iter_mut().find(|item| item.item_id == item_id as u32).unwrap();
            item.upgrade();

            //update currency
            return cost_consequence!(-(item.sell_value as i32));
        }

        cost_consequence!(0)
    }

}

pub struct ActiveItems {
    //TODO: If items require a class and limitation of 1 per class active, add in individual item slots
    items: [Option<Item>; 6]
}

//TODO: Perhaps add some item related operations as traits to be implemented by Inventory and ActiveItems
impl ActiveItems {
    pub fn new() -> Self {
        ActiveItems {
            items: Default::default(),
        }
    }

    pub fn get_item_ids(&self) -> Vec<u32> {
        self.items.iter().filter_map(|item| item.as_ref()).map(|item| item.item_id).collect()
    }

    pub fn get_item_from_id(&self, item_id: u32) -> Option<&Item> {
        self.items.iter().filter_map(|item| item.as_ref()).find(|item| item.item_id == item_id)
    }

    pub fn is_all_full(&self) -> bool {
        self.items.iter().all(|item| item.is_some())
    }

    pub fn add_item(&mut self, item: Item) {

        if let Some(slot) = self.items.iter_mut().find(|slot| slot.is_none()) {
            *slot = Some(item);
        }
    }

    pub fn remove_item(&mut self, item_id: usize) -> Consequence {
        //if character inventory contains item with id == item_id
        //remove item from inventory
        let mut consequence = cost_consequence!(0);
        //check if item is in inventory
        for item_option in self.items.iter_mut() {
            if let Some(item) = item_option {
                if item.item_id == item_id as u32 {
                    consequence = cost_consequence!(-(item.sell_value as i32));
                    *item_option = None;
                    break;
                }
            }
        }

        consequence
    }

    pub fn upgrade_item(&mut self, item_id: usize) -> Consequence {
        let mut consequence = cost_consequence!(0);
        //check if item is in inventory
        for item_option in self.items.iter_mut() {
            if let Some(item) = item_option {
                if item.item_id == item_id as u32 {
                    consequence = cost_consequence!(-(item.sell_value as i32));
                    item.upgrade();
                    break;
                }
            }
        }

        consequence
    }
}