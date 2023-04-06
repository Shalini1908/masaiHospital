const express = require("express")
const {connection} = require("./db")
const {userRouter} = require("./routes/user.routes")
const {appointmentRouter} = require("./routes/appointments.routes")
const {auth} = require("./middleware/auth.middleware")
require("dotenv").config()
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(cors())

app.get("/",(req,res)=>{
res.send("Welcome to Masai Hospital")    
})


app.use("/user",userRouter)
app.use(auth)
app.use("/appointment",appointmentRouter)

app.listen(process.env.port,async(req,res)=>{

try{

await connection
console.log("Connected to DB")

}
catch(err){
console.log(err)

}
console.log("Server is ruuning on port 8080")
})