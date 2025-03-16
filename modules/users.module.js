const mongoose = require("mongoose")
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    todos: {
        type: mongoose.Types.ObjectId,
        ref: "Todo"
    }
})

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next()
    try{
        this.password = await bcrypt.hash(this.password, 10)
        return next()
    }
    catch (error) {
        return next(error)
    }
})

module.exports = mongoose.model("User", userSchema)