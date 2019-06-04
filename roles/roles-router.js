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

// using async/await
// router.post('/', async (req, res) => {
//   try {
//     const role = await Roles.add(req.body)

//     res.status(201).json(role);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

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
