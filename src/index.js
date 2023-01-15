import status from "../db/blood-status.json";
import { Hono } from "hono";

import { cors } from "hono/cors";

const app = new Hono();
app.use(cors({ origin: "*" }));

app.get("/status", (ctx) => ctx.json(status));
app.get("/", (ctx) => ctx.json("hola"));
