import fetch from "node-fetch";
import { load } from "cheerio";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import fs from "node:fs";

const url = "http://www.donantescordoba.org";
//const url = "https://web.archive.org/web/20230331130951/http://www.donantescordoba.org/";

const run = async () => {
  const response = await fetch(url);
  const body = await response.text();

  let $ = load(body);

  const $types = $("#block-block-16 table td");
  const types = [];

  let $lastChanged;

  $types.each((index, el) => {
    const $el = $(el);

    if (index === 8) {
      $lastChanged = $el.find("b").text();
    } else {
      types.push($el.text().trim());
    }
  });

  const lastChanged = $lastChanged
    .replace("Actualizadas a ", "")
    .replace(" h.", "")
    .replaceAll(" ", "")
    .replace("-", " ");

  const hasChangedData = await hasBeenChanged(lastChanged);
  if(!hasChangedData) {    
    await log('No changes in data');
    return 
  }

  const $states = $("#block-block-16 img");
  const states = [];

  $states.each((index, el) => {
    const $el = $(el);
    if (index === 8) return;

    states.push($el.attr().title.trim());
  });

  const result = [];
  types.forEach((type, index) => {
    result.push({ type, state: states[index] });
  });

  
  
  const currentData = await readDBFile("blood-status");
  const updatesData = await readDBFile("blood-update");

  const lastData = Array.from(currentData).concat({date: new Date().toISOString(), result})

  const logUpdatesOrigin = Array.from(updatesData).concat({ lastChanged, ejecutionTime: new Date().toISOString() }) 

  await writeDBFile("blood-status", lastData);
  await writeDBFile("blood-update", logUpdatesOrigin);

  
  await log('DB updated successfully');
};

const DB_PATH = path.join(process.cwd(), "./db/");

export function readDBFile(dbName) {
  return new Promise((resolve, reject) => {
    fs.readFile(`${DB_PATH}/${dbName}.json`, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }      
      resolve(JSON.parse(data));
    });
  });
}


export function writeDBFile(dbName, data) {
  return writeFile(
    `${DB_PATH}/${dbName}.json`,
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}

export function updateDBFile(dbName, data) {
  fs.appendFile(`${DB_PATH}/${dbName}.json`,JSON.stringify(data, null, 2) ,async (err) =>{
    if(err) throw err;
    await log('Update DB data');
  } )
}

export async function hasBeenChanged (lastChanged) {
  const updatesData = await readDBFile("blood-update");

  const lastUpdate = updatesData[updatesData.length - 1].lastChanged
  if(lastUpdate === lastChanged) return false;
  return true;
}

export async function log (data) {
  const logData = await readDBFile("blood-logs");
  const dataToSave = Array.from(logData).concat({ message: data, datetime: new Date().toISOString() }) 

  await writeDBFile("blood-logs", dataToSave);

  console.log(data);
}

run();
