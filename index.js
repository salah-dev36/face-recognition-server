const express = require("express");
const parser = require("body-parser");
const cors = require("cors");
const knex = require("knex");
const bcrypt = require("bcrypt");

const { handleSignIn, handleSignUp, recognize } = require("./controllers");

// connexion to database:

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "salah123",
    database: "smartbrain",
  },
});

// app intialization:

const app = express();
app.use(parser.json());
app.use(cors());

//endpoints;

app.post("/signin", handleSignIn(db, bcrypt));
app.post("/signup", handleSignUp(db, bcrypt));
app.put("/recognize", recognize(db));

app.listen(3001, () => {
  console.log(`app is running on port 3001`);
});
