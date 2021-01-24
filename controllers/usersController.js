require("dotenv").config();

// Import required dependencies
const usersService = require("../models/usersModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// JWT Secret
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
      const users = await usersService.find();
      users.forEach((user) => delete user.password);
      res.json(users);
    } catch (err) {
      err.msg = "failed to receive users";
      res.status(500).json({ msg: err.msg, errno: err.errno, code: err.code });
    }
  },

  // FIND USER BY ID
  findById: (req, res) => {
    let user = req.user;
    delete user.password;
    res.json(user);
  },

  // UPDATE USER INFO
  update: async (req, res) => {
    let user = req.user;
    const changes = req.body;
    try {
      const updatedUser = await usersService.update(changes, user.id);
      delete updatedUser.password;
      res.json(updatedUser);
    } catch (err) {
      err.msg = "failed to update user";
      res.status(500).json({ msg: err.msg, errno: err.errno, code: err.code });
    }
  },

  // DELETE USER
  delete: async (req, res) => {
    let user = req.user;
    try {
      const deletedUser = await usersService.delete(user.id);
      delete user.password;
      res.json({ success: deletedUser, ...user });
    } catch (err) {
      err.msg = "failed to remove user";
      res.status(500).json({ msg: err.msg, errno: err.errno, code: err.code });
    }
  },
};

// Generate Token Function
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
