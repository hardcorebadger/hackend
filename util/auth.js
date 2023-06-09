const jwt = require('jsonwebtoken');

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

const signToken = (user) => {
  return jwt.sign({
    user: user.email
  }, 'secret', { expiresIn: '3m' });
}

module.exports = {
  auth,
  signToken
}