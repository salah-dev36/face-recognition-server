const express = require("express");
const parser = require("body-parser");
const knex = require("knex");
const bcrypt = require("bcrypt");

const { handleSignIn, handleSignUp, recognize } = require("./controllers");

// connexion to database:

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

// app intialization:

const app = express();
app.use(parser.json());


//endpoints;
app.get("/", (req, res) => {
  res.send("Face-detection-app-API");
});
app.post("/signin", handleSignIn(db, bcrypt));
app.post("/signup", handleSignUp(db, bcrypt));
app.put("/recognize", recognize(db));

app.listen(process.env.PORT || 3001, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});
