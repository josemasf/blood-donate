import fetch from "node-fetch";
import { load } from "cheerio";
const url = "http://www.donantescordoba.org";

const response = await fetch(url);
const body = await response.text();

let $ = load(body);

let title = $("#block-block-16");
console.log(title.html());
