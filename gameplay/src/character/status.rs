use crate::rule_engine::RuleEngine;
use crate::ActionType;
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
    pub item_id: u32,
}

#[derive(Clone)]
pub struct Consequence {
    pub wisdom: i32,
    pub attack: i32,
    pub luck: i32,
    pub charm: i32,
    pub family: i32,
    pub speed: i32,
    pub defence: i32,
    pub age: i32,
    pub currency: i32,
    pub life: i32,
    pub item_drop: Option<Vec<ItemDrop>>
}

impl Consequence {
    pub fn new_delta(
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
    pub consequence: Consequence,
    pub description_id: u32,
}

#[derive(Clone)]
pub struct Event {
    pub event_id: u32,
    pub choices: Vec<Choice>,
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

    pub fn apply_consequence(&mut self, consq: Consequence) {
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
