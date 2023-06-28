use crate::{
    Consequence,
    Choice,
    Event,
    ItemDrop,
};

fn create_choice(dscp_id: &mut u32, consq: Consequence) -> Choice {
    let c = Choice {
        consequence: consq,
        description_id: *dscp_id,
        
    };
    *dscp_id += 1;
    c
}

#[macro_export]
macro_rules! consequence {
    ($wisdom:expr, $attack:expr, $luck:expr, $charm:expr, $family:expr,
        $speed:expr, $defence:expr, $age:expr, $currency:expr, $life:expr, $drop:expr) =>
    {
        Consequence {
            wisdom: $wisdom,
            attack: $attack,
            luck: $luck,
            charm: $charm,
            family: $family,
            speed: $speed,
            defence: $defence,
            age: $age,
            currency: $currency,
            life: $life,
            item_drop: $drop,
        }
    }
}

#[macro_export]
macro_rules! cost_consequence {
    ($currency:expr) =>
    {
        Consequence {
            wisdom: 0,
            attack: 0,
            luck: 0,
            charm: 0,
            family: 0,
            speed: 0,
            defence: 0,
            age: 0,
            currency: $currency,
            life: 0,
            item_drop: None,
        }
    }
}

#[macro_export]
macro_rules! drop {
    ($item_id:expr) => {
        ItemDrop {
            item_id: $item_id,
        }
    };
}
#[macro_export]
macro_rules! drop_item {
    ($id:expr) => {
        ItemDrop {
            item_id: $id,
        }
    };
}
#[macro_export]
macro_rules! drop_example {
    ($itemdrops:expr) => {
        // Modify your macro to call `.get()` on the Lazy<Vec<ItemDrop>>
        Consequence {
            wisdom: 0,
            attack: 0,
            luck: 0,
            charm: 0,
            family: 0,
            speed: 0,
            defence: 0,
            age: 0,
            currency: 0,
            life: 0,
            //TODO: cannot alloc vec for const variable so must use this macro in runtime
            item_drop: Some($itemdrops),
        }
    };
}


const WISDOM_INC_BASIC: Consequence = consequence!(1,0,0,0,0,0,0,0,0,0, None);
const WISDOM_DEC_BASIC: Consequence = consequence!(-1,0,0,0,0,0,0,0,0,0, None);
const HEALTH_DEC_BASIC: Consequence = consequence!(0,0,0,0,0,0,0,0,0,-25, None);
const COST_BASIC: Consequence = cost_consequence!(-1);
const INCOME_BASIC: Consequence = cost_consequence!(1);


pub(crate) fn standard_pack() -> Vec<Event> {
    let mut dscp_id = 0;
    vec![
        Event {
            event_id: 0,
            choices: vec![
                create_choice(&mut dscp_id,
                    WISDOM_INC_BASIC,
                ),
                create_choice(&mut dscp_id,
                    INCOME_BASIC,
                ),
                create_choice(&mut dscp_id,
                    drop_example!(vec![drop!(0), drop!(1), drop!(2)]),
                ),
            ]
        },
        Event {
            event_id: 1,
            choices: vec![
                create_choice(&mut dscp_id,
                    WISDOM_DEC_BASIC,
                ),
                create_choice(&mut dscp_id,
                    COST_BASIC,
                ),
                create_choice(&mut dscp_id,
                    drop_example!(vec![drop!(2), drop!(1), drop!(0)]),
                ),
            ]
        },
        Event {
            event_id: 2,
            choices: vec![
                create_choice(&mut dscp_id,
                    HEALTH_DEC_BASIC,
                ),
                create_choice(&mut dscp_id,
                    HEALTH_DEC_BASIC,
                ),
                create_choice(&mut dscp_id,
                    drop_example!(vec![drop!(3), drop!(4), drop!(5)]),
                ),
            ]
        }
    ]
}
