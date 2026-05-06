import express from 'express'
import dotenv from 'dotenv'
dotenv.config()




// const port = 8000
const port = process.env.PORT 



const app = express()

app.get("/",(req, res)=>{
    res.send("Hello from Server")
})

app.listen(port, ()=>{
    console.log("Server Started")
})