use crate::game_mod::GameMod;

pub trait Service:
{
    fn get_name(&self) -> &str;

    fn get_mods(&self) -> Result<Vec<GameMod>, Box<dyn std::error::Error>>;
}