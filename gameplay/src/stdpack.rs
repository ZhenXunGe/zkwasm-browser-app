use crate::{
    Consequence,
    Choice,
    Event,
};

fn create_choice(dscp_id: &mut u32, consq: Consequence) -> Choice {
    let c = Choice {
        consequence:Consequence::new_delta(1,0,0,0,0,0,0,0,0),
        description_id: *dscp_id,
    };
    *dscp_id += 1;
    c
}

#[macro_export]
macro_rules! consequence {
    ($wisdom: expr, $attack: expr, $luck: expr) => 
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


const v: Consequence = consequence!(0, 0, 0);


pub(crate) fn standard_pack() -> Vec<Event> {
    let mut dscp_id = 0;
    vec![
        Event {
            event_id: 0,
            choices: vec![
                create_choice(&mut dscp_id, 
                    Consequence::new_delta(1,0,0,0,0,0,0,0,-4)
                ),
                create_choice(&mut dscp_id, 
                    Consequence::new_delta(0,0,0,0,0,0,0,0,-1)
                ),
                create_choice(&mut dscp_id, 
                    Consequence::new_delta(-1,0,0,0,0,0,0,0,0)
                ),
            ]
        }
    ]
}
