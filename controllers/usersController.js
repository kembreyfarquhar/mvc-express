require("dotenv").config();

const usersService = require("../models/usersModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || "secret";

// SQLITE ERROR NUMBERS
const errnos = { 19: "username must be unique" };

// METHODS THAT USE THE MODEL TO PERFORM CRUD OPERATIONS AND SEND JSON RES
module.exports = {
  // REGISTER USER
  register: async (req, res) => {
    let { username, password } = req.body;
    const hash = bcrypt.hashSync(password, 10);
    password = hash;
    const user = { username, password };
    try {
      const newUser = await usersService.register(user);
      delete user.password;
      const fullUser = { id: newUser[0], ...user };
      const token = genToken(fullUser);
      res.json({ ...fullUser, token: token });
    } catch (err) {
      err.msg = "failed to create user";
      if (errnos[err.errno]) err.msg = errnos[err.errno];
      res.status(500).json({ msg: err.msg, errno: err.errno, code: err.code });
    }
  },

  // LOGIN USER
  login: (req, res) => {
    const user = req.user;
    delete user.password;
    const token = genToken(user);
    res.status(200).json({ token, ...user });
  },

  // FIND ALL USERS
  find: async (req, res) => {
    try {
      const users = await usersService.find({ ...req.query });
      users.forEach((user) => delete user.password);
      res.json(users);
    } catch (err) {
      err.msg = "failed to receive users";
      res.status(500).json({ msg: err.msg, errno: err.errno, code: err.code });
    }
  },

  // FIND USER BY ID
  findById: async (req, res) => {
    try {
      const user = await usersService.findById(req.params.id);
      delete user.password;
      res.json(user);
    } catch (err) {
      err.msg = "failed to find user";
      res.status(500).json({ msg: err.msg, errno: err.errno, code: err.code });
    }
  },

  // UPDATE USER INFO
  update: async (req, res) => {
    let { id } = req.params;
    const changes = req.body;
    try {
      const foundUser = await usersService.findById(id);
      if (!foundUser)
        res.status(400).json({ message: "user not found with given id" });
      else {
        const updatedUser = await usersService.update(changes, id);
        res.json(updatedUser);
      }
    } catch (err) {
      err.msg = "failed to update user";
      res.status(500).json({ msg: err.msg, errno: err.errno, code: err.code });
    }
  },

  // DELETE USER
  delete: async (req, res) => {
    let { id } = req.params;
    try {
      const foundUser = await usersService.findById(id);
      if (!foundUser)
        res.status(400).json({ message: "user not found with given id" });
      else {
        const deletedUser = await usersService.delete(id);
        res.json(deletedUser);
      }
    } catch (err) {
      err.msg = "failed to remove user";
      res.status(500).json({ msg: err.msg, errno: err.errno, code: err.code });
    }
  },
};

function genToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };

  const options = {
    expiresIn: "1d",
  };
  return jwt.sign(payload, secret, options);
}
