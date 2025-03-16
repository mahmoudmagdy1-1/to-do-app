const Todo = require("../modules/todo.module")
const User = require("../modules/users.module")
const jwt = require("jsonwebtoken")

const addTodo = async (req, res) => {
    try {
        let {title, description, status} = req.body
        status = status === true
        if (!title || !description) {
            return res.status(400).json({error: "All fields are required"})
        }
        const todo = new Todo({title, description, status, user: req.user._id})
        await todo.save()
        await User.findByIdAndUpdate(req.user._id, {$push: {todos: todo._id}})
        res.status(201).json({
            success: true,
            message: "Todo added successfully",
            todo : [
                {
                    "id": todo._id,
                    "title": todo.title,
                    "description": todo.description,
                    "status": todo.status,
                    "userID": todo.user
                }]
        })
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const updateTodoStatus = async (req, res) => {
    try {
        let {status} = req.body
        status = status === true
        await Todo.findByIdAndUpdate(req.params.id, {status: status }, {new: true})
        res.status(201).json({
            success: true,
            message: "Todo updated successfully"
        })
    } catch (error) {
        res.status(400).json({"message" : "Todo not found"})
    }
}

const deleteTodo = async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id)
        res.status(201).json({
            success: true,
            message: "Todo deleted successfully"
        })
    } catch (error) {
        res.status(400).json({"message" : "Todo not found"})
    }
}

const getTodoById = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id)
        res.status(201).json({
            success: true,
            todo : [
                {
                    "id": todo._id,
                    "title": todo.title,
                    "description": todo.description,
                    "status": todo.status,
                    "userID": todo.user
                }]
        })
    } catch (error) {
        res.status(400).json({"message" : "Todo not found"})
    }
}

const getAllTodos = async (req, res) => {
    try {
        const todos = await Todo.find({user: req.user._id}, {__v: 0})
        res.status(201).json({
            success: true,
            todos
        })
    } catch (error) {
        res.status(400).json({"message" : "Todos not found"})
    }
}

const getRemainTodo = async (req, res) => {
    try {
        const todos = await Todo.find({user: req.user._id, status: false}, {__v: 0})
        res.status(201).json({
            success: true,
            todos
        })
    } catch (error) {
        res.status(400).json({"message" : "Todos not found"})
    }
}

module.exports = {addTodo, updateTodoStatus, deleteTodo, getTodoById, getAllTodos, getRemainTodo}