import fetch from "node-fetch";
import { load } from "cheerio";
import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";

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

  await writeDBFile("blood-status", result);
  await writeDBFile("blood-update", { lastChanged });
};

const DB_PATH = path.join(process.cwd(), "./db/");

export function readDBFile(dbName) {
  return readFile(`${DB_PATH}/${dbName}.json`, "utf-8").then(JSON.parse);
}

export function writeDBFile(dbName, data) {
  return writeFile(
    `${DB_PATH}/${dbName}.json`,
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}

run();
