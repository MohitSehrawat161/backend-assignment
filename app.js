const express = require("express");
const app = express();

app.use(express.json())

app.use("/user", (req, res) => {
  console.log(req.body)
  res.status(200).json({
    status: "success",
  });
});

module.exports=app
