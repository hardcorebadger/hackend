const express = require("express")
const routes = express.Router();
const axios = require('axios');
const {auth, signToken} = require('../util/auth.js')
const {saveTable, loadTable} = require('../util/db.js')

// routes

routes.post('/api/login', (req, res) => {
  let users = loadTable('users')
  // user doesnt exist
  if (!users[req.body.email]) 
    return res.sendStatus(401)

  // password incorrect
  user = users[req.body.email]
  if (user.password !== req.body.password) {
    return res.sendStatus(401)
  } 

  // login
  return res.send({
    "user":user,
    "access_token":signToken(user)
  })
  
})

routes.post('/api/google', async (req, res) => {
  try {
    // hit up google
    const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo?access_token="+req.body.credential)
    const data = response.data
    
    // failed auth
    if (!data.email) 
      return res.sendStatus(401)

    let users = loadTable('users')
    if (!users[data.email]) {
      // register
      users[data.email] = {
        "email":data.email,
        "first_name":data.given_name,
        "last_name":data.family_name,
        "password": null
      }
      user = users[data.email]
      saveTable('users', users)
      return res.send({
        "user":user,
        "access_token":signToken(user)
      })

    } else {
      // login
      user = users[data.email]
      return res.send({
        "user":user,
        "access_token":signToken(user)
      })
    }
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
})

routes.post('/api/register', (req, res) => {
  let users = loadTable('users')
  users[req.body.email] = req.body
  user = users[req.body.email]
  saveTable('users', users)
  return res.send({
    "user":user,
    "access_token":signToken(user)
  })
})

routes.post('/api/logout', auth, (req, res) => {
  return res.send({
    "message":"user logged out"
  })
})

routes.post('/api/refresh', auth, (req, res) => {
  user = loadTable('users')[req.user]
  return res.send({
    "user":user,
    "access_token":signToken(user)
  })
})

routes.get('/api/me', auth, (req, res) => {
  user = loadTable('users')[req.user]
  return res.send({
    "user":user
  })
})

module.exports = routes