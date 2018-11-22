const express = require('express')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router()

const db = require('../controller/mysql-connection')

router.post("/new", (req, res, next) => {
  if ( req.body.username && req.body.password ) {
    db.queryUser(req.body.username)
    .then(rows => {
      if (rows.length > 0) 
        return Promise.reject({code:409, message:'User exists'})
      else 
        return generatePasswordHash(req.body.password)
    })
    .then((hash) => {
      const user = {
        username: req.body.username,
        password: hash,
        admin: req.body.admin ? 1 : 0,
        access: req.body.admin ? 'admin' : req.body.access ? req.body.access : 'guest'
      }
      return db.insertNewUser(user)
    })
    .then(() => {
      res.status(201).json({
        message: "User created"
      })
    })
    .catch(err => {
      const { code, message } = err
      res.status(code).json({
        error: message
      })
    })
  } // if (req.body.username && req.body.password)
  else {
    res.status(500).json({
      error: 'Missing fields'
    })
  }
})

router.post("/login", (req, res, next) => {
  if ( req.body.username && req.body.password ) {
    var user = {}
    db.queryUser(req.body.username)
    .then(rows => {
      if (rows.length == 0) 
        return Promise.reject({code:401, message:'User doesn\'t exist'})
      else {
        user = rows[0]
        return comparePasswords(req.body.password, user.password)
      }
    })
    .then(() => {
      return db.updateUserLastActive(user.username)
    })
    .then(() => {
      const token = jwt.sign(
        { username: user.username, access: user.accessGroup },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      )
      res.status(200).json({
        message: "Authentication OK",
        token: token
      })
    })
    .catch(err => {
      const { code, message } = err
      res.status(code).json({
        error: message
      })
    })
  } // if (req.body.username && req.body.password)
  else {
    res.status(500).json({
      error: 'Missing fields'
    })
  }
})

router.patch("/edit/:username", (req, res, next) => {
  if ( req.body.password || req.body.admin || req.body.access ) {
    var user = {}
    db.queryUser(req.params.username)
    .then(rows => {
      if (rows.length == 0) 
        return Promise.reject({code:401, message:'User doesn\'t exist'})
      else {
        user = rows[0]
        if (req.body.password) return generatePasswordHash(req.body.password)
        else return Promise.resolve(user.password)
      }
    })
    .then((hash) => {
      user = {
        username: req.params.username,
        password: hash,
        admin: req.body.admin ? 1 : 0,
        access: req.body.admin ? 'admin' : req.body.access ? req.body.access : 'guest'
      }
      return db.updateUser(user)
    })
    .then(() => {
      res.status(200).json({
        message: "User updated"
      })
    })
    .catch(err => {
      const { code, message } = err
      res.status(code).json({
        error: message
      })
    })
  } // if ( req.body.password || req.body.admin || req.body.access )
  else {
    res.status(500).json({
      error: 'Missing fields'
    })
  }
})

router.delete("/delete/:username", (req, res, next) => {
  db.queryUser(req.params.username)
  .then(rows => {
    if (rows.length == 0) 
      return Promise.reject({code:401, message:'User doesn\'t exist'})
    else 
      return db.deleteUser(req.params.username)
  })
  .then(() => {
    res.status(200).json({
      message: "User deleted"
    })
  })
  .catch(err => {
    const { code, message } = err
    res.status(code).json({
      error: message
    })
  })
})

module.exports = router

const generatePasswordHash = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) reject({code:500, message:err})
			else resolve(hash)
    })
  })
}

const comparePasswords = (thisPassword, toMatchPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(thisPassword, toMatchPassword, (err, result) => {
      if (err) reject({code:401, message:'Wrong password'})
			else resolve()
    })
  })
}