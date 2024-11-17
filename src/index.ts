import express from 'express'
import dotenv from 'dotenv'
import { connectDb } from './config/dbConnect'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import errorHandler from './middlewares/errorHandler'
import router from './routes/index'
dotenv.config()

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json({limit: '50mb'}))
app.use(cookieParser())
app.use(morgan('dev'))
app.use(cors({
  origin: process.env.ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD']
}))

app.get('/health',(_,res)=>{
    res.status(200).json({message:'Server is running'})
})

app.use(`/${process.env.VERSION}`, router)

app.get('*', (req, res)=> {
    res.status(404).json({
      success: false,
      message: "Requested url not found🫥"
    })
})

app.use(errorHandler)

connectDb().then(()=>{
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}).catch((e)=>{
    console.error("Error connecting to database", e)
    process.exit(1)
})



