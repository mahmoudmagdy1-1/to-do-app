const jwt = require("jsonwebtoken")
const Users = require("../modules/users.module")

// Check if user is authenticated (for protected routes)
const checkUser = async (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({error: "Unauthorized - no token provided"})
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await Users.findById(decoded.id).select("-password")
        if (!user) {
            return res.status(404).json({error: "User not found"})
        }
        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({error: "Unauthorized - invalid token"})
    }
}

// Check if user is already logged in (to block signup/signin)
const checkLoggedIn = async (req, res, next) => {
    const token = req.cookies.token
    if (token) {
        return res.status(403).json({error: "Already logged in"})
    }
    next()
}

module.exports = {checkUser, checkLoggedIn}