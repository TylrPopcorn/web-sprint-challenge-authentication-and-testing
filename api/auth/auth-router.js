const router = require('express').Router();
const bcrypt = require("bcryptjs")

const authMiddleware = require("./auth-middleware")
const authModel = require("./auth-model")

const jwt = require("jsonwebtoken")

router.post('/register', authMiddleware.checkNameAvailable, async (req, res, next) => {
  //  res.end('implement register, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */

  try {
    let username = req.body.username.trim()
    let password = req.body.password.trim();

    let hash = bcrypt.hashSync(password, 8)
    let result = await authModel.add({ username, password: hash });

    if (result) {
      res.status(201).json(result)
    } else {
      throw Error(`result = '${result}`)
    }

  } catch (err) {
    next(err)
  }


});

router.post('/login', authMiddleware.checkNameExists, async (req, res, next) => {
  //res.end('implement login, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */

  try {
    let username = req.body.username.trim()
    let password = req.body.password.trim();

    let result = await authModel.findBy({
      username: username
    });

    if (result) {
      // console.log("Yes", result)
      let result2 = await authModel.findBy({ type: "name", username: result[0].username })
      //console.log(result2, "Ygsf")
      console.log(password, result2.password, "TESTS")


      if (bcrypt.compareSync(password, result2.password)) {
        const token = buildToken(result2)

        res.status(201).json({
          message: `welcome, ${result2.username}`,
          token: token,
        })
      } else {
        next({
          status: 401,
          message: "Invalid credentials"
        })
      }
    } else {
      // console.log("no", result)
      throw Error(`invalid credentials`)
    }

  } catch (err) {
    next(err)
  }

});

function buildToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  }
  const options = {
    expiresIn: "1d",
  }

  return jwt.sign(payload, "shhh", options)
}

module.exports = router;
