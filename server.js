const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const morgan = require("morgan");

const users = require("./routes/users");

const app = express();

app.use(express.json());

app.use(morgan("combined"));

app.use("/api/v1/users", users);

const PORT = process.env.PORT || 4500;

app.listen(PORT, console.log("App listening on port 4500!"));
