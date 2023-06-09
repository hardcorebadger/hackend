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
const testRoutes = require('./routes/auth.js')
router.use(testRoutes)
app.use('/', router)
//start server
app.listen(8000, ()=>{
    console.log("listening at http://localhost:8000")
}) 