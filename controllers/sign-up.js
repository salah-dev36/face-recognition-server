const handleSignUp = (db, bcrypt) => (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json("invalid-form-fields");
  } else {
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
    }).catch((err) => {
      res.status(400).json(err)
      // if (code == 23505) {
      //   res.status(400).json("existant-email");
      // } else {
      //   res.status(400).json("failure");
      // }
    });
  }
};

module.exports = { handleSignUp };
