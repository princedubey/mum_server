import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 3000

const app = express()

app.get('/health',(_,res)=>{
    res.status(200).json({message:'Server is running'})
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

