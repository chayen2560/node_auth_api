const express = require('express')
const router = express.Router()

const checkAuth = require('../controller/check-auth');
const checkAccess = require('../controller/check-access')

router.use('/users', require('./users'))

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'success'
  })
})

router.get('/protected', checkAuth, (req, res, next) => {
  res.status(200).json({
    message: 'success'
  })
})

router.get('/guest-protected', checkAuth, (req, res, next) => {
  checkAccess(req.userData.access, 'guest')
  .then(() => {
    res.status(200).json({
      message: 'success'
    })
  })
  .catch(err => {
    const { code, message } = err
    res.status(code).json({
      error: message
    })
  })
})

router.get('/admin-protected', checkAuth, (req, res, next) => {
  checkAccess(req.userData.access, 'admin')
  .then(() => {
    res.status(200).json({
      message: 'success'
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
