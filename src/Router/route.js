const express= require("express")
const router= express.Router()
const  userController = require("../controller/userController")
const middleWare = require("../middleware/auth.js")



router.post('/registration',userController. createUser)
router.get("/fetching data",userController. getUserdata)
router.put("/update/:userId",userController. updateUser)
router.delete("/delete/:userId",userController.deleteUser)




module.exports = router;