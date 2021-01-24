const knex = require("knex");
require("dotenv").config();

const knexConfig = require("../knexfile");
const environment = process.env.NODE_ENV || "development";

module.exports = knex(knexConfig[environment]);
