const db = require("../data/dbConfig");

// METHODS THAT TALK TO THE DATABASE
module.exports = {
  find: () => db("users").select("*"),
  findById: (id) => db("users").where({ id }).first(),
  findByUsername: (username) => db("users").where({ username }).first(),
  register: async (userData) => {
    const newUser = await db("users").insert(userData).returning("*");
    return newUser;
  },
  update: async (changes, id) => {
    const updatedUser = await db("users")
      .where({ id })
      .update(changes)
      .returning("*");
    return updatedUser;
  },
  delete: (id) => db("users").where({ id }).del(),
};
