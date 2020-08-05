const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const morgan = require("morgan");

const users = require("./routes/users");
const books = require("./routes/books");

const app = express();

app.use(express.json());

app.use(morgan("combined"));

app.use("/api/v1/users", users);
app.use("/api/v1/books", books);

const PORT = process.env.PORT || 4500;

app.get("/", (req, res, next) => {
  res.json({ success: true });
});

app.listen(PORT, console.log("App listening on port 4500!"));
