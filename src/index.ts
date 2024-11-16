import express from 'express'
import dotenv from 'dotenv'
import { connectDb } from './config/dbConnect'
dotenv.config()

const PORT = process.env.PORT || 3000

const app = express()

app.get('/health',(_,res)=>{
    res.status(200).json({message:'Server is running'})
})

connectDb().then(()=>{
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
      })
}).catch((e)=>{
    console.error("Error connecting to database", e)
    process.exit(1)
})



