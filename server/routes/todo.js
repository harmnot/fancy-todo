const express = require("express");
const router = express.Router();
const Controller = require("../controller/service-todo.js");

router.post("/sigup", Controller.createUser);
router.post("/login", Controller.login);
router.post("/addtask", Controller.createTask);
router.get("/mytask/:id", Controller.findMytask);
router.post("/loginGoogle", Controller.loginGoogle);
router.delete("/deletetask/:id", Controller.destroytask);

module.exports = router;
