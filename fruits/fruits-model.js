const db = require('../data/db-config.js');

module.exports = {
  find,
  findById,
  add
}

function find() {
  return db('fruits');
}

function findById(id) {
  return db('fruits').where({ id });
}

async function add(fruit) {
  const [ id ] = await db('fruits').insert(fruit);

  return findById(id);
}