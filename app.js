const express = require("express");
const app = express();
const userRoutes=require('./routes/userRoutes')

app.use(express.json())

app.use('/api/v1/users',userRoutes)

app.use((err,req,res,next)=>{
 const statusCode=err.statusCode || 500 
 const message=err.message || 'Something went wrong.' 
 res.status(statusCode).json({
  status:'fail',
  message:message
 })
})

module.exports=app
