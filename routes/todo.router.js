const express = require("express")
const router = express.Router()
const {checkUser} = require("../middlewares/auth.middleware")
const todoController = require("../controllers/todo.controller")
router.post("/add-todo", checkUser, todoController.addTodo)
router.put("/change-status/:id", checkUser, todoController.updateTodoStatus)
router.delete("/delete-todo/:id", checkUser, todoController.deleteTodo)
router.get('/getById/:id', checkUser, todoController.getTodoById)
router.get('/get-todos', checkUser, todoController.getAllTodos)
router.get("/get-remain-todo", checkUser, todoController.getRemainTodo)

module.exports = router