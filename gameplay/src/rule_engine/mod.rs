use crate::ActionType;
use crate::character::status::{Event, Status};

pub struct RuleEngine {
    leads: Vec<Vec<Event>>,
    current_instance: usize,
}

impl RuleEngine {
    pub fn new(leads: Vec<Vec<Event>>, current_instance: usize) -> Self {
        RuleEngine { leads, current_instance }
    }
    fn select_leads(&self, current_instance: usize) -> usize {
        0
    }
    fn select_event(&self, acttype: usize) -> usize {
        acttype
    }
    pub fn pick_event(&self, s: &Status, acttype: ActionType) -> &Event {
        let acttype = acttype as usize;
        &self.leads[self.select_leads(self.current_instance)][self.select_event(acttype)]
    }

    //TODO: Validate and implement instance changing and how it should affect the game. If it is only affecting events, then leave in RuleEngine, otherwise maybe move to character
    pub fn get_current_instance(&self) -> usize {
        self.current_instance
    }

    pub fn set_current_instance(&mut self, instance: usize) {
        self.current_instance = instance;
    }

    // fn status_score(&self, s: &Status) -> u32 {
    //     // Determine a weighted score for the status
    //     // This will be used to determine which event to pick
    // }
}
