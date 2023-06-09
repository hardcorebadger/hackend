const express = require("express")
const routes = express.Router();
const axios = require('axios');
const {auth, signToken} = require('../util/auth.js')
const {saveTable, loadTable} = require('../util/db.js')

// routes

routes.post('/api/login', (req, res) => {
  let users = loadTable('users')
  if (!users[req.body.email]) {
    res.sendStatus(401)
  } else {
    user = users[req.body.email]
    if (user.password !== req.body.password) {
      res.sendStatus(401)
    } else {
      res.send({
        "status":"success",
        "user":user,
        "authorisation": {
          "token":signToken(user),
          "type":"bearer"
        }
      })
    }
  }
})

routes.post('/api/google', async (req, res) => {
  try {
    const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo?access_token="+req.body.credential)
    const data = response.data
    if (!data.email) {
      res.sendStatus(401)
    } else {
      let users = loadTable('users')
      if (!users[data.email]) {
        // create the user
        users[data.email] = {
          "email":data.email,
          "first_name":data.given_name,
          "last_name":data.family_name,
          "password": null
        }
        user = users[data.email]
        saveTable('users', users)
        res.send({
          "status":"success",
          "user":user,
          "authorisation": {
            "token":signToken(user),
            "type":"bearer"
          }
        })
      } else {
        user = users[data.email]
        res.send({
          "status":"success",
          "user":user,
          "authorisation": {
            "token":signToken(user),
            "type":"bearer"
          }
        })
      }
    }
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})

routes.post('/api/register', (req, res) => {
  let users = loadTable('users')
  console.log(req.body.email)
  users[req.body.email] = req.body
  user = users[req.body.email]
  saveTable('users', users)
  res.send({
    "status":"success",
    "user":user,
    "authorisation": {
      "token":signToken(user),
      "type":"bearer"
    }
  })
})

routes.post('/api/logout', auth, (req, res) => {
  res.send({
    "status":"success",
    "message":"user logged out"
  })
})

routes.post('/api/refresh', auth, (req, res) => {
  user = loadTable('users')[req.user]
  res.send({
    "status":"success",
    "user":user,
    "authorisation": {
      "token":signToken(user),
      "type":"bearer"
    }
  })
})

routes.get('/api/me', auth, (req, res) => {
  user = loadTable('users')[req.user]
  res.send(user)
})

module.exports = routes