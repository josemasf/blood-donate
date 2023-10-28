import status from "../db/blood-status.json";
import update from "../db/blood-update.json";
import logs from "../db/blood-logs.json";

import { Hono } from "hono";
import { poweredBy } from "hono/powered-by";

import { cors } from "hono/cors";

const app = new Hono();
app.use(cors({ origin: "*" }));

app.use("*", poweredBy());

app.get("/logs", (ctx) => ctx.json(logs));
app.get("/update", (ctx) => ctx.json(update));
app.get("/last-status", (ctx) => {
  
  const result = status.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  return ctx.json(result)
});
app.get("/status", (ctx) => ctx.json(status));
app.get("/status/:type", (ctx) => {  
  const sortedStatus = status.result[0].status.sort((a, b) => new Date(b.date) - new Date(a.date));  
  const statusFiltered = sortedStatus.find((item) => item.type === ctx.req.param("type"));
  return statusFiltered
    ? ctx.json(statusFiltered)
    : ctx.json({ message: `Type ${ctx.req.param("type")} not found` }, 404);
});
app.get("/", (ctx) => {
  return ctx.json([
    {
      endpoint: "/last-status",
      description: "Returns the last status of the blood bank of Córdoba Spain",
    },
    {
      endpoint: "/status",
      description: "Returns status of the blood bank of Córdoba Spain",
      parameters: [
        {
          name: "type",
          endpoint: "/status/:type",
          description:
            "Returns status of the blood bank of Córdoba Spain by type of blood",
        },
      ],
    },
    {
      endpoint: "/update",
      description: "Returns the date of last update of the information",
    },
    {
      endpoint: "/logs",
      description: "Returns the logs of the scraper running",
    },
  ]);
});

export default app;
