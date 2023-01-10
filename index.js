const express = require("express");
const parser = require("body-parser");
const cors = require("cors");
const knex = require("knex");
const bcrypt = require("bcrypt");



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
console.log(process.env.POSTGRES_PASSWORD)

app.use(parser.json());
app.use(cors());



//authentication endpoint:

app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  db.select("email", "hash")
    .from("login")
    .where({
      email,
    })
    .then((credentials) => {
      const compare = bcrypt.compareSync(password, credentials[0].hash);
      if (compare) {
        return db
          .select("*")
          .from("users")
          .where({ email })
          .then((user) => res.json(user[0]));
      } else {
       return res.status(400).json("wrong-credentials");
      }
    })
    .catch((err) => res.status(400).json("inexistant-user"));
});



//registration endpoint:

app.post("/signup", (req, res) => {
  const { email, password, name } = req.body;

  const hash = bcrypt.hashSync(password, 10);
  db.transaction((trx) => {
    trx
      .insert({
        hash,
        email,
      })
      .into("login")
      .returning("email")
      .then((emailObject) => {
        return trx("users")
          .returning("*")
          .insert({
            email: emailObject[0].email,
            name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(({ code }) => {
    if (code == 23505) {
      res.status(400).json("existant-email");
    } else {
      res.status(400).json("failure");
    }
  });
});



//updating user entries endpoint:

app.put("/recognize", (req, res) => {

});



//quering user info endpoint:

app.get("/profile/:id", (req, res) => {});



app.listen(3001, () => {
  console.log(`app is running on port 3001`);
});
