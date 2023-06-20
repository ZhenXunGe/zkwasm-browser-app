use crate::items::{Inventory};
use crate::Status;
use crate::skills::{Skill, Skills};

pub struct Character {
    savings: u32,
    inventory: Inventory,
    life: u32,
    max_life: u32,
    status: Status,
    skills: Skills,
}

impl Character {
    pub fn new() -> Self {
        Character {
            savings: 0,
            inventory: Inventory::new(),
            life: 100,
            max_life: 100,
            status: Status::new(),
            skills: Skills::new(),
        }
    }

    pub fn get_life(&self) -> u32 {
        self.life
    }

    pub fn get_savings(&self) -> u32 {
        self.savings
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

    pub fn add_skill(&mut self, new_skill: Skill) {
        self.skills.add_skill(new_skill);
    }

    pub fn set_life(&mut self, life: u32) {
        self.life = life;
    }

    pub fn set_savings(&mut self, savings: u32) {
        self.savings = savings;
    }

    pub fn set_status(&mut self, status: Status) {
        self.status = status;
    }

    pub fn set_inventory(&mut self, inventory: Inventory) {
        self.inventory = inventory;
    }
}