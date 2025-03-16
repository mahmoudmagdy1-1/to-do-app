const express = require('express')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const db = require('./db')
const authRoutes = require('./routes/auth.router')

const app = express()
const port = 3001

// console.log(db.connectDB())

app.use(express.json())
app.use(cookieParser())


app.use('auth', authRoutes)

app.listen(port, () => {
    db.connectDB()
    console.log("app listening on port 3001")
})