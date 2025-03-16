const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
const User = require("../modules/users.module")

const maxAge = 3 * 24 * 60 * 60

const createToken = (id) => {
    return jwt.sign({id}, "secret", {
        expiresIn: maxAge,
    })
}

const signUp = async (req, res) => {
    try {
        const {username, email, password} = req.body
        const user = await User.create({username, email, password})
        const token = createToken(user._id)
        res.cookie("jwt", token, {httpOnly: true, maxAge: maxAge * 1000})
        res.status(201).json({"success": true, "message": "User created successfully"})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const signIn = async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" })
        }
        const auth = await bcrypt.compare(password, user.password)
        if (!auth) {
            return res.status(400).json({ error: "Invalid email or password" })
        }
        const token = createToken(user._id)
        res.cookie("jwt", token, {httpOnly: true, maxAge: maxAge * 1000})
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

module.exports = {
    signUp,
    signIn
}