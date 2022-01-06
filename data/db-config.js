const knex = require('knex');

const configs = require('../knexfile.js');

const env = process.env.NODE_ENV || 'development';

const connection = knex(configs[env]);

module.exports = connection; // the connection is what we require as "db" elsewhere
