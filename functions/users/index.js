const express = require("express");
const jwtMiddleware = require("express-jwt")({ secret: process.env.JWT });
const router = express.Router();
const AWS = require("../aws");
const jwt = require("jsonwebtoken");
const elastic = require("../elastic");
const userSchema = require("../schema/user");
const { contacts, contact } = require("./contacts");
const { friends } = require("./friends");
const { interested } = require("./interested");
const feed = require("./feed");
const account = require("./account");

const sh = require("shorthash");

const sns = new AWS.SNS();

const codesMap = new Map();

const minWait = 1000 * 60;

const jwtSecret = process.env.JWT;

router.use(
  jwtMiddleware.unless({ path: ["/api/users/login", "/api/users/token"] })
);

router.use(function(err, req, res, next) {
  if (err && err.name === "UnauthorizedError") {
    res.send({
      error: "Invalid Token"
    });
  } else {
    next(err, req, res, next);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { number } = req.body;

    if (!number || number.length < 10) {
      throw new Error("Invalid number");
    }

    if (process.env.PHONE !== number) {
      const code = addCode(number);
      const params = {
        PhoneNumber: `+1${number}`,
        Message: `Your Buncha login code is ${code}`,
        MessageStructure: "string"
      };
      sns.publish(params).promise();
    } else {
      codesMap.set(number, {
        code: "123456",
        attempts: 0,
        lastAttempt: Date.now()
      });
    }

    res.send({});
  } catch (error) {
    res.send({
      error: error.message
    });
  }
});

router.post("/token", async (req, res) => {
  try {
    const { number, code } = req.body;

    validateCode(number, code);

    const id = sh.unique(number);

    const token = jwt.sign({ id }, jwtSecret);

    const existingUser = await elastic
      .get({
        id,
        index: userSchema.index
      })
      .catch(error => {});

    if (existingUser) {
      res.send({
        token,
        user: existingUser
      });
      return;
    }

    await elastic.index({
      index: userSchema.index,
      id,
      body: {
        number
      }
    });

    res.send({
      user: null,
      token
    });
  } catch (error) {
    res.send({
      error: error.message
    });
  }
});

router.post("/contacts", contacts);

router.post("/contact", contact);

router.post("/friends", friends);

router.post("/interested", interested);

router.post("/feed", feed);

router.post("/account", account);

module.exports = router;

function addCode(number) {
  const code = `${Math.floor(Math.random() * 900000) + 100000}`;

  const now = Date.now();

  let data = {
    lastAttempt: now,
    code,
    attempts: 0
  };

  if (codesMap.has(number)) {
    data = codesMap.get(number);

    const timeDiff = data.lastAttempt - now;

    if (data.attempts > 3 && timeDiff < minWait) {
      throw new Error("Too many attempts");
    }

    data.attempts += 1;
    data.code = code;
    data.lastAttempt = now;
  }

  while (codesMap.size > 3000) {
    const key = codesMap.keys().next().value;
    codesMap.delete(key);
  }

  codesMap.set(number, data);

  return code;
}

function validateCode(number, code) {
  if (!number || number.length < 10 || !code || code.length !== 6) {
    throw new Error("Invalid request");
  }

  const data = codesMap.get(number);

  if (!data) {
    throw new Error("Invalid number");
  }

  if (data.code !== code) {
    throw new Error("Invalid code");
  }

  codesMap.delete(number);
}
