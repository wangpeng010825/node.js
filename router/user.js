let express = require("express");
let userRouter = express.Router();
let userHandler=require('../router-handler/user.js')
userRouter.post('/login',userHandler.login)
userRouter.post('/regUser',userHandler.regUser)

module.exports = userRouter;
