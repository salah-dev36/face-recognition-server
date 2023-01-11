const recognize = (db) => (req, res) => {
    const { id } = req.body;
    return db("users")
      .where({ id })
      .increment("entries")
      .returning(["id", "name", "email", "entries", "joined"])
      .then((users) => {
        return res.json(users[0]);
      })
      .catch((err) => res.status(400).json("inexsitant-user"));
};

module.exports = { recognize };
