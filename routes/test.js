const express = require("express")
const routes = express.Router();
const axios = require('axios');
const {auth} = require('../util/auth.js')
const {saveTable, loadTable} = require('../util/db.js')

// routes

routes.post('/test', auth, (req, res) => {
  users = loadTable('users')
  user = users[req.user]
  if (!user.data) {
    user.data = 1
  } else {
    user.data = user.data + 1
  }
  users[req.user] = user
  saveTable('users', users)
  return res.send({'status':'success','data':user.data})
})

module.exports = routes