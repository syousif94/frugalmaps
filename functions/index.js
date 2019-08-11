require("dotenv").config();
require("isomorphic-fetch");

const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");

const schema = require("./schema/elastic");

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

async function main() {
  try {
    await schema.init();
    app.listen(2000, () => console.log(`frugal:2000!`));
  } catch (error) {
    console.log(error);
  }
}

app.get("/api", (req, res) => {
  res.send("FrugalMaps API says hi");
});

app.post("/api/places/suggest", require("./places/suggest"));
app.post("/api/places/popular", require("./places/popular"));
app.post("/api/places/reverse", require("./places/reverse"));
app.post("/api/places/id", require("./places/id"));

app.post("/api/save-event", require("./saveEvent"));
app.post("/api/query-events", require("./queryEvents"));
app.post("/api/delete-event", require("./deleteEvent"));
app.post("/api/fetch-event", require("./fetchEvent"));
app.post("/api/fetch-events", require("./fetchEvents"));

app.post("/api/delete-submissions", require("./deleteSubmissions"));

app.post("/api/sync-user", require("./syncUser"));
app.post("/api/sync-reminder", require("./syncReminder"));
app.post("/api/notify-nearby", require("./notifyNearby"));

app.post("/api/events", require("./getEvents"));
app.post("/api/events/published", require("./events/published"));
app.post("/api/events/published/count", require("./events/publishedCount"));
app.post("/api/events/submissions", require("./events/submissions"));
app.post("/api/events/suggest", require("./events/suggest"));

app.post("/api/bulk", require("./bulk"));
app.get("/api/stats", require("./stats"));

app.get("/e/:id", require("./events/render"));

main();
