const express = require("express")
const routes = express.Router();
const fs = require('fs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

// util functions 

const saveTable = (table, data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync('./data/'+table+'.json', stringifyData)
}

const loadTable = (table) => {
    const jsonData = fs.readFileSync('./data/'+table+'.json')
    return JSON.parse(jsonData)    
}

const auth = (req, res, next) => {
  const bearerHeader = req.headers['authorization']
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ')
    const token = bearer[1]
    try {
      const decoded = jwt.verify(token, 'secret')
      req.user = decoded.user
      next()
    } catch(err) {
      res.sendStatus(401)
    }
  } else {
    res.sendStatus(401)
  }
}

const sign_token= (user) => {
  return jwt.sign({
    user: user
  }, 'secret', { expiresIn: '3m' });
}

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
          "token":sign_token(user),
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
        req.user = users[data.email]
        saveTable('users', users)
        res.send({
          "status":"success",
          "user":req.user,
          "authorisation": {
            "token":sign_token(req.user),
            "type":"bearer"
          }
        })
      } else {
        req.user = users[data.email]
        res.send({
          "status":"success",
          "user":req.user,
          "authorisation": {
            "token":sign_token(req.user),
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
  req.user = users[req.body.email]
  saveTable('users', users)
  res.send({
    "status":"success",
    "user":req.user,
    "authorisation": {
      "token":sign_token(req.user),
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
  res.send({
    "status":"success",
    "user":req.user,
    "authorisation": {
      "token":sign_token(req.user),
      "type":"bearer"
    }
  })
})

routes.get('/api/me', auth, (req, res) => {
  res.send(req.user)
})

module.exports = routes