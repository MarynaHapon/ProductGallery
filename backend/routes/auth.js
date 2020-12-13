const Router = require('express').Router;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const database = require('../database');

const router = Router();

const createToken = () => {
  return jwt.sign({}, 'secret', { expiresIn: '1h' });
};

router.post('/login', (req, res, next) => {
  const email = req.body.email;
  const pw = req.body.password;

  database
    .get()
    .db()
    .collection('users')
    .findOne({ email: email })
    .then((result) => bcrypt.compare(pw, result.password))
    .then((result) => {
      if (!result) {
        throw Error()
      }

      const token = createToken();
      res
        .status(200)
        .json({ message: 'Authentication succeeded', token: token });
    })
    .catch((error) => {
      res
      .status(401)
      .json({ message: 'Authentication failed, invalid username or password.' });
    });
});

router.post('/signup', (req, res, next) => {
  const email = req.body.email;
  const pw = req.body.password;
  // Hash password before storing it in database => Encryption at Rest
  bcrypt
    .hash(pw, 12)
    .then(hashedPW => {
      database
       .get()
       .db()
       .collection('users')
       .insertOne({
         email: email,
         password: hashedPW,
       })
       .then((result) => {
        const token = createToken();
        res
          .status(201)
          .json({ token: token, user: { email: email } });
       })
       .catch((error) => {
        console.log(error);
        res.status(500).json({ message: 'Creating the user failed.' });
       })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Creating the user failed.' });
    });
});

module.exports = router;
