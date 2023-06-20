use crate::{
    Consequence,
};

// Skills are immutable to a character once learned and cannot be forgotten
pub struct Skill {
    skill_id: u32,
    consequence: Consequence, // Status effect of a skill
}

pub struct Skills {
    skills: Vec<Skill>,
}

impl Skills {
    pub fn new() -> Self {
        Skills {
            skills: Vec::new(),
        }
    }

    pub fn get_skill_ids(&self) -> Vec<u32> {
        self.skills.iter().map(|skill| skill.skill_id).collect()
    }

    pub fn add_skill(&mut self, skill: Skill) {
        self.skills.push(skill);
    }
}