const knex = require("knex");
const configFile = require("../knexfile.js");

module.exports = knex(configFile.development);
