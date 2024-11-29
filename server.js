const app=require('./app')
const dotenv = require("dotenv");
dotenv.config({path:'./config.env'})
const mongoose=require('mongoose')

const mongoUri=process.env.MONGODB_URI
mongoose.connect(mongoUri).then(()=>{
  
  console.log('db connected successfuly')
})

const port = process.env.PORT || 3000;

app.listen(port,()=>{
  console.log(`App is running on Port ${port}`)
})