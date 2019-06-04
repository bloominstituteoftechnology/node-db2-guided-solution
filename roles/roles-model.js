const knex = require('knex');

const knexConfig = {
  client: 'sqlite3', // the npm module we installed
  useNullAsDefault: true, // needed when working with SQLite
  connection: {
    filename: './data/rolex.db3', // we need to create the data folder and the rolex.db3 database
  },
};

const db = knex(knexConfig);

module.exports = {
  find,
  findById,
  add,
  update,
  remove,
};

function find() {
  // check knex docs for the different ways to get data from tables
  // we'll use the following format
  return db('roles');
}

function findById(id) {
  return db('roles')
    .where({ id })
    .first();
}

function add(role) {
  return db('roles')
    .insert(role, 'id')
    .then(ids => {
      const [id] = ids;

      return findById(id);
    });
}

function update(id, changes) {
  return db('roles')
    .where({ id })
    .update(changes)
    .then(count => {
      if (count > 0) {
        return findById(id);
      } else {
        return null;
      }
    });
}

function remove(id) {
  return findById(id).then(role => {
    if (role) {
      return db('roles')
        .where({ id })
        .del()
        .then(() => {
          return role;
        });
    } else {
      return null;
    }
  });
}
