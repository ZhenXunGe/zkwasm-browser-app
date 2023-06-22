use crate::{
    Consequence,
    Choice,
    Event,
};

fn create_choice(dscp_id: &mut u32, consq: Consequence, item_id: Option<usize>) -> Choice {
    let c = Choice {
        consequence: consq,
        description_id: *dscp_id,
        item_id: item_id,
    };
    *dscp_id += 1;
    c
}

#[macro_export]
macro_rules! consequence {
    ($wisdom:expr, $attack:expr, $luck:expr, $charm:expr, $family:expr,
        $speed:expr, $defence:expr, $age:expr, $currency:expr) =>
    {
        Consequence {
            wisdom: $wisdom,
            attack: $attack,
            luck: $luck,
            charm: 0,
            family: 0,
            speed: 0,
            defence: 0,
            age: 0,
            currency: 0,
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
        }
    }
}


const WISDOM_INC_BASIC: Consequence = consequence!(1,0,0,0,0,0,0,0,-1);
const WISDOM_DEC_BASIC: Consequence = consequence!(-1,0,0,0,0,0,0,0,-1);
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
                    None
                ),
                create_choice(&mut dscp_id,
                    INCOME_BASIC,
                    Some(0)
                ),
                create_choice(&mut dscp_id,
                    WISDOM_DEC_BASIC,
                    Some(1)
                ),
            ]
        }
    ]
}
