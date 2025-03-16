const express = require('express')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const db = require('./db')
const authRoutes = require('./routes/auth.router')
const todoRoutes = require('./routes/todo.router')

const app = express()
const port = 3003

app.use(express.json())
app.use(cookieParser())


app.use(authRoutes)
app.use(todoRoutes)


app.listen(port, () => {
    db.connectDB()
    console.log(`app listening on port ${port}`)
})