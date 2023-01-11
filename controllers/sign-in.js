const handleSignIn = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  if (!email || password) {
    return res.status(400).json("invalid-form-fields");
  } else {
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
  }
};

module.exports = { handleSignIn };
