const express=require('express')
const userController=require('../controllers/userControler')
const authController=require('../controllers/authController')

const router=express.Router()
console.log(userController.signup)

router.post('/signup',authController.signup)
router.post('/login',authController.login)

router.get('/',userController.getAllUsers)

module.exports=router