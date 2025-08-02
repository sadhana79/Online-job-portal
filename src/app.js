let express = require("express");
let bodyParser = require("body-parser");
let db = require("../db.js");
let router = require("./routes/route.js");
require("dotenv").config();

let app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", router);

module.exports = app;
