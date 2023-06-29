use crate::ActionType;
use crate::character::status::{Event, Status};

pub struct RuleEngine {
    leads: Vec<Vec<Event>>,
}

impl RuleEngine {
    pub fn new(leads: Vec<Vec<Event>>) -> Self {
        RuleEngine { leads }
    }
    fn select_leads(&self) -> usize {
        0
    }
    fn select_event(&self) -> usize {
        0
    }
    pub fn pick_event(&self, s: &Status, acttype: ActionType) -> &Event {
        let acttype = acttype as usize;
        &self.leads[self.select_leads()][acttype]
    }
}
