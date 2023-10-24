import fetch from "node-fetch";
import { load } from "cheerio";
import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import fs from "node:fs";

const url = "http://www.donantescordoba.org";

export async function scrape(url) {
  const res = await fetch(url);
  const html = await res.text();
  return cheerio.load(html);
}

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

  const $states = $("#block-block-16 img");
  const states = [];

  $states.each((index, el) => {
    const $el = $(el);
    if (index === 8) return;

    states.push($el.attr().title.trim());
  });

  const result = [];
  types.forEach((type, index) => {
    result.push({ type, state: states[index], date: new Date().toISOString() });
  });

  const lastChanged = $lastChanged
    .replace("Actualizadas a ", "")
    .replace(" h.", "")
    .replaceAll(" ", "")
    .replace("-", " ");

  //const dateUpdate = lastChanged
  const currentData = await readDBFile("blood-status");

  const lastData = Array.from(currentData).join(result)

  await writeDBFile("blood-status", lastData);
  await writeDBFile("blood-update", { lastChanged });
};

const DB_PATH = path.join(process.cwd(), "./db/");

export function readDBFile(dbName) {
  return new Promise((resolve, reject) => {
    fs.readFile(`${DB_PATH}/${dbName}.json`, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      console.log((JSON.parse(data)), 'data')
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
  fs.appendFile(`${DB_PATH}/${dbName}.json`,JSON.stringify(data, null, 2) ,(err) =>{
    if(err) throw err;
    console.log('Update DB data');
  } )

}

run();
