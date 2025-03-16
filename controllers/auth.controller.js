const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')

const User = require("../modules/users.module")

const maxAge = 3 * 24 * 60 * 60

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: maxAge,
    })
}

const signUp = async (req, res) => {
    try {
        const { email, password, username } = req.body
        if(!email || !password || !username) {
            return res.status(400).json({ error: "All fields are required" })
        }
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" })
        }
        const newUser = new User({ username, email, password })
        await newUser.save()
        const token = createToken(newUser._id)
        res.cookie("token", token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(201).json({ success: true, "message": "User registered successfully" })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const signIn = async (req, res) => {
    try {
        const {email, password} = req.body
        if(!email || !password) {
            return res.status(400).json({ error: "All fields are required" })
        }
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" })
        }
        const auth = await bcrypt.compare(password, user.password)
        if (!auth) {
            return res.status(400).json({ error: "Invalid email or password" })
        }
        token = createToken(user._id)
        res.cookie("token", token, {httpOnly: true, maxAge: maxAge * 1000})
        res.status(201).json({"success": true, "user": [
                {
                    "username": user.username,
                    "email": user.email,
                    "id": user._id
                }
            ]})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const signOut = async (req, res) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(403).json({error: "Not logged in"})
        }
        res.clearCookie("token")
        res.status(200).json({"success": true, "message": "User signed out successfully"})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    signUp,
    signIn,
    signOut
}