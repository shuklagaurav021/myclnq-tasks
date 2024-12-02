"use strict";

/*

This file exports the app that is used by the server to expose the routes.
And make the routes visible.
*/
const express = require("express");
const pinoHttp = require("pino-http");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require('helmet');
const logger = require("../src/utils/logger");

const routes = require("./routes");

const app = express();
app.use(
  bodyParser.json({
    limit: "50mb",
    extended: true,
  })
);
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));


app.use(pinoHttp({ logger }));

app.use(cors());
app.use(helmet());

app.use("/ping", function (req, res) {
  res.json({ reply: "pongg" });
  res.end();
});
routes(app); 
module.exports = app;
