import status from "../db/blood-status.json";
import { Hono } from "hono";
import { poweredBy } from "hono/powered-by";

import { cors } from "hono/cors";

const app = new Hono();
app.use(cors({ origin: "*" }));

app.use("*", poweredBy());

app.get("/status", (ctx) => ctx.json(status));
app.get("/status/:type", (ctx) => {
  const foundStatusbyType = status.find(
    (statu) => statu.type === ctx.req.param("type")
  );
  return foundStatusbyType
    ? ctx.json(foundStatusbyType)
    : ctx.json({ message: `Type ${ctx.req.param("type")} not found` }, 404);
});
app.get("/", (ctx) => {
  return ctx.text("Hello Hono!");
});

export default app;
