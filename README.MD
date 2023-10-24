# BLOOD DONATE

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

## :pencil: About the project

Blood donate is a scraper for Córdoba (Spain) Blood Bank Status. It also provides an API to check the scraped data.

## :building_construction: Architecture

- Cheerio: an HTML parsing and manipulation library for Node.js.
- Hono: a utility library for Node.js.
- Node-fetch: a library for making HTTP requests from Node.js using the Fetch API.
- Request: a simplified library for making HTTP requests from Node.js.
- Wrangler: a command-line tool for working with Cloudflare Workers.

## :rocket: Actions

We have 2 Github Actions

- publish-api.yml a cron job to deploy the API
- scrape-donantescordoba.yml a cron jon to scrape the web and update de API data

## :house: Site

https://blood-donate.josemasf.workers.dev/

## Usage

Run script `scrape` to update localy data from [Córdoba Blood bank](http://www.donantescordoba.org)

## :sparkles: Authors

[José María Santos](https://josemariasantos.com/)

