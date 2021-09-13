const express = require("express");
const bodyParser = require("body-parser");
const { restartApp } = require("./scalingo");

const app = express();

// used to authenticate against this app
const { APP_TOKEN, PORT } = process.env;

const port = PORT || 3000;

app.use(bodyParser.json());

app.post("/hook", async (req, res, next) => {
  const token = req.query.token;
  if (token !== APP_TOKEN) {
    return res.status(403);
  }
  const eventType = req.body.type;
  const appId = req.body.app_id;
  const appName = req.body.app_name;
  console.log("Received hook", JSON.stringify(req.body));
  if (eventType === "alert") {
    try {
      await restartApp(appId);
      return res.send(`App ${appName} restarted`);
    } catch (err) {
      return next(err);
    }
  } else {
    return res.send("OK");
  }
});

app.listen(port, () => {
  console.log(
    `Trackdechets scalingo hook listening at http://localhost:${port}`
  );
});
