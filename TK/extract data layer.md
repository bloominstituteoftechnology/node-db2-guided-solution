- add a `roles-model` file to the `roles` folder, next to the `roles-router`.
- export an object with methods for the CRUD operations the router needs.

```js
module.exports = {
  find,
  findById,
  add,
  update,
  remove,
};

function find() {
  return null;
}

function findById(id) {
  return null;
}

function add(role) {
  return null;
}

function update(id, changes) {
  return null;
}

function remove(id) {
  return null;
}
```

- inside `roles-router` add: `const Roles = require('./roles-model.js');`

Now we're ready to move the data access code out of the router and into the data layer.

```js
// inside roles-model we need access to knex, for now just copy the code from the router
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
```

Notice that our data layer doesn't know nor care the technology used for to handle HTTP requests, we could rip out Express and start using Koa and the data layer would not be affected.

It's time to remove the data access code from the routing layer.

```js
// inside roles-router
const router = require('express').Router();

const Roles = require('./roles-model.js');

router.get('/', (req, res) => {
  Roles.find() // returns a promise, so we need the bros
    .then(roles => {
      res.status(200).json(roles);
    })
    .catch(error => {
      // we'll return the error during development to see what it is
      res.status(500).json(error); // in production handle the error and return a nice message
    });
});

router.get('/:id', (req, res) => {
  // returns the role if it was found or a falsy value if not
  Roles.findById(req.params.id)
    .then(role => {
      if (role) {
        res.status(200).json(role);
      } else {
        res.status(404).json({ message: 'Role not found' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/', (req, res) => {
  // returns the added role
  Roles.add(req.body)
    .then(role => {
      res.status(201).json(role);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.put('/:id', (req, res) => {
  // returns the updated role or null if the role is not found
  Roles.update(req.params.id, req.body)
    .then(role => {
      if (role) {
        res.status(200).json(role);
      } else {
        res.status(404).json({ message: 'Role not found' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.delete('/:id', (req, res) => {
  Roles.remove(req.params.id)
    .then(role => {
      if (role) {
        // return the deleted role?
        res.status(200).json(role);
      } else {
        res.status(404).json({ message: 'Role not found' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

module.exports = router;
```

Notice that the router no longer needs to know how the data is persisted, we can later change from Knex + SQLite to Mongoose + Mongo and the router doesn't need to change unless the API for the data layer changes.
