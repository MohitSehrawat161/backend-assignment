const express = require("express");
const mongoSanitize=require('express-mongo-sanitize')

const app = express();
const userRoutes=require('./routes/userRoutes')

app.use(mongoSanitize())
app.use(express.json())

app.use('/api/v1/users',userRoutes)

app.use((err,req,res,next)=>{
 const statusCode=err.statusCode || 500 
 const message=err.message || 'Something went wrong.' 
 console.log(message)
 res.status(statusCode).json({
  status:'fail',
  message:message
 })
})

module.exports=app
