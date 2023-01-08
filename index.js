const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("it's working");
});

app.post("/signin", (req, res) => {
  res.send("sign in");
});

app.post("/signup", (req, res) => {
  res.send("sign up");
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  res.send("profile/" + id);
});

app.post("recognize", (req, res) => {
    res.send("recognize")
})

app.listen(3001, () => {
  console.log(`app is running on port 3001`);
});
