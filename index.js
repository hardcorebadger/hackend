const express = require("express")
const bodyParser = require("body-parser")
const fs = require('fs');
const cors = require('cors')

// create our express app
const app = express()
// middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
// route
const router = express.Router();
router.use(require('./routes/auth.js'))
router.use(require('./routes/test.js'))
app.use('/', router)
//start server
app.listen(process.env.PORT || 3000, ()=>{
    console.log("we're live baby")
}) 