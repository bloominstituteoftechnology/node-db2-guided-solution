# DB II Guided Project Solution

Guided project solution for **DB II** Module.

Starter code is here: [Web DB II Guided Project](https://github.com/LambdaSchool/webdb-ii-guided).

## Prerequisites

- [SQLite Studio](https://sqlitestudio.pl/index.rvt?act=download) installed.
- [This Query Tool Loaded in the browser](https://www.w3schools.com/Sql/tryit.asp?filename=trysql_select_top).

## Starter Code

The [Starter Code](https://github.com/LambdaSchool/webdb-ii-guided) for this project is configured to run the server by typing `yarn server` or `npm run server`. The server will restart automatically on changes.

## How to Contribute

- clone the [starter code](https://github.com/LambdaSchool/webdb-ii-guided).
- create a solution branch: `git checkout -b solution`.
- add this repository as a remote: `git remote add solution https://github.com/LambdaSchool/webdb-ii-guided-solution`
- pull from this repository's `master` branch into the `solution` branch in your local folder `git pull solution master:solution --force`.

A this point you should have a `master` branch pointing to the student's repository and a `solution` branch with the latest changes added to the solution repository.

When making changes to the `solution` branch, commit the changes and type `git push solution solution:master` to push them to this repository.

When making changes to the `master` branch, commit the changes and use `git push origin master` to push them to the student's repository.

## Introduce Module Challenge

Introduce the project for the afternoon. If they are done early, encourage them to study tomorrow's content and follow the tutorials on TK.

## Introduce Knex Query Builder

Go through a brief explanation of what a `Query Builder` is and how it is simpler than a full fledge ORM like [Sequelize](http://docs.sequelizejs.com/), while providing a nice API we can use from JS.

Explain that the query builder will translate from JavaScript code to the correct SQL for each Database Management System.

Explain that the library also provides a way to use raw SQL for things that are not supported through the JS API.

**Take a break if it's a good time**

Next we'll add Knex to the project and configure it to connect to an existing SQLite database.

## Configure Knex to Connect to SQLite

Knex uses different database drivers, depending on the target DBMS. For SQLite it uses the `sqlite3` npm module.

Add [Knex](https://www.npmjs.com/package/knex) and [the SQLite3 driver](https://www.npmjs.com/package/sqlite3) to the project.

Inside `./roles/roles-router.js`

- require `knex`
- build configuration object that `knex` needs to be able to find and connect to the database.
- get a configured instance of `knex` by invoking `knex` and passing it the configuration object.

```js
// right after const router = require('express').Router();
const knex = require('knex');
// this configuration object teaches knex how to find the database and what driver to use
const knexConfig = {
  client: 'sqlite3', // the npm module we installed
  useNullAsDefault: true, // needed when working with SQLite
  connection: {
    // relative to the root folder
    filename: './data/rolex.db3', // we need to create the data folder and the rolex.db3 database
  },
};

const db = knex(knexConfig);
```

- create the `data` folder
- use `SQLite Studio` to manually create the `rolex.db3` file inside the `data` folder.
- add a `roles` table and remember to **commit changes** to the database file.
- use the `data` tab in SQLite Studio to add test data. Add `Student`, `PM` and `Flex TA` roles.

Roles table Schema

| Column | Type         | Metadata                              |
| ------ | ------------ | ------------------------------------- |
| id     | integer      | Primary Key, Auto-increment, Not Null |
| name   | varchar(128) | Unique, Not Null                      |

**wait for students to catch up, use a `yes/no` poll to let students tell you when they are done**

Next we will learn how to retrieve all data from a table using `knex`.

## Use Knex to Retrieve Data

Inside `roles-router.js` modify the `GET /` endpoint to retrieve a list of roles.

```js
router.get('/', (req, res) => {
  // check knex docs for the different ways to get data from tables
  // we'll use the following format
  db('roles') // returns a promise, so we need the bros
    .then(roles => {
      res.status(200).json(roles);
    })
    .catch(error => {
      res.status(500).json(error); // we'll return the error during development to see what it is
    });
});
```

- make a `GET` request to `/api/roles` and enjoy the wonderful square brackets.

**wait for students to catch up, use a `yes/no` poll to let students tell you when they are done**

### You Do (estimated 5 minutes to complete)

Ask students to write a `GET /:id` endpoint to find a `role` by it's `id`.

One possible solution:

```js
router.get('/:id', (req, res) => {
  db('roles')
    .where({ id: req.params.id }) // always returns an array
    // show the results without adding .first(), then come back and add it to remove the wrapping array
    .first() // grabs the first element of the array, we could also just use [0] to retrieve it manually
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
```

**wait for students to catch up, use a `yes/no` poll to let students tell you when they are done**

**Take a break if it's a good time**

Next we will learn how to add data to a database table using `knex`.

## Use Knex to Add Data

```js
router.post('/', (req, res) => {
  // db('roles').insert(req.body).then([id] => {
  // or alternatively:
  db('roles')
    .insert(req.body)
    .then(ids => {
      const [id] = ids;

      db('roles')
        .where({ id })
        .first()
        .then(role => {
          res.status(200).json(role);
        });
    })
    .catch(error => {
      res.status(500).json(error);
    });
});
```

**wait for students to catch up, use a `yes/no` poll to let students tell you when they are done**

## Use Knex to Update Data

```js
router.put('/:id', (req, res) => {
  db('roles')
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        db('roles')
          .where({ id: req.params.id })
          .first()
          .then(role => {
            res.status(200).json(role);
          });
      } else {
        res.status(404).json({ message: 'Role not found' });
      }
    })
    .catch(error => {
      // this catch will be run for any errors including errors in the nested call to get the role by id
      res.status(500).json(error);
    });
});
```

**wait for students to catch up, use a `yes/no` poll to let students tell you when they are done**

## Use Knex to Remove Data

```js
router.delete('/:id', (req, res) => {
  db('roles')
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(204).end(); // we could also respond with 200 and a message
      } else {
        res.status(404).json({ message: 'Role not found' });
      }
    })
    .catch(error => {
      // this catch will be run for any errors including errors in the nested call to get the role by id
      res.status(500).json(error);
    });
});
```

**wait for students to catch up, use a `yes/no` poll to let students tell you when they are done**

## Extract Data Access to a Model File

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

## Add Validation (coming soon)

## Add a findBy Method (coming soon)
