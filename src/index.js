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
  const appId = req.body.app_id;
  const appName = req.body.app_name;
  try {
    await restartApp(appId);
    res.send(`App ${appName} restarted`);
  } catch (err) {
    next(err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
