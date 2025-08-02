import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { connectMongoDB } from "./connection/db.js"
import MFroutes from "./routes/Routers.js"

dotenv.config()
const app = express()

const corsOptions = {
  origin: 'https://microfinanc.netlify.app',  
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH',], 
  credentials: true, 
};

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors(corsOptions))
app.use(cookieParser())

//Route
app.use("/api", MFroutes)
app.use("/",(req, res) => res.json({msg: "server start"}));

const PORT = process.env.PORT || 8080
connectMongoDB()
  .then(() => {
    console.log("MongoDB connected")
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((err) => {
    console.error(" MongoDB connection failed:", err.message);
    process.exit(1)
  })
