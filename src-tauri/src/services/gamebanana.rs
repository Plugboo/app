use std::error::Error;
use crate::game_mod::GameMod;
use crate::services::service::Service;

const BASE_URL: &str = "https://gamebanana.com/apiv11";

#[derive(Debug, serde::Serialize, serde::Deserialize)]
#[serde()]
#[allow(non_snake_case)]
struct Metadata {
    _nRecordCount: i32,
    _bIsComplete: bool,
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
#[serde()]
#[allow(non_snake_case)]
struct Submitter {
    _idRow: i32,
    _sName: String,
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
#[serde()]
#[allow(non_snake_case)]
struct SubfeedRecord {
    _idRow: i32,
    _sName: String,
    _tsDateAdded: i64,
    _tsDateModified: i64,
    _aSubmitter: Submitter,
    _sVersion: Option<String>,
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
#[serde()]
#[allow(non_snake_case)]
struct SubfeedResult {
    _aMetadata: Metadata,
    _aRecords: Vec<SubfeedRecord>,
}

pub struct GameBanana {}

impl Service for GameBanana {
    fn get_name(&self) -> &str {
        "GameBanana"
    }

    fn get_mods(&self) -> Result<Vec<GameMod>, Box<dyn std::error::Error>> {
        let resp = reqwest::blocking::get(format!("{}/Game/{}/Subfeed?_csvModelInclusions=Mod", BASE_URL, "8552"))?
            .json::<SubfeedResult>()?;
        let mut mods = Vec::<GameMod>::new();

        for record in resp._aRecords.iter() {
            mods.push(convert_record_to_mod(self.get_name(), &record)?);
        }

        Ok(mods)
    }

    fn get_mod(&self, id: &str) -> Result<GameMod, Box<dyn Error>> {
        let record = reqwest::blocking::get(format!("{}/Mod/{}/ProfilePage", BASE_URL, id))?
            .json::<SubfeedRecord>()?;
        
        Ok(convert_record_to_mod(self.get_name(), &record)?)
    }
}

fn convert_record_to_mod(name: &str, record: &SubfeedRecord) -> Result<GameMod, Box<dyn Error>> {
    Ok(GameMod {
        id: record._idRow.to_string(),
        name: record._sName.to_string(),
        service: name.to_string(),
        author: record._aSubmitter._sName.to_string(),
        version: if record._sVersion.is_some() { record._sVersion.clone().unwrap() } else { "N/A".to_string() },
    })
}