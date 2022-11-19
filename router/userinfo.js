const express = require('express')
let userinfoHandler=require('../router-handler/userinfo.js')
const router = express.Router()
router.get('/userinfo',userinfoHandler.getUserInfo)
router.post('/userinfo', userinfoHandler.updateUserInfo)
router.post('/updatepwd', userinfoHandler.updatePassword)
router.post('/updateavatar', userinfoHandler.updateAvatar)
module.exports = router