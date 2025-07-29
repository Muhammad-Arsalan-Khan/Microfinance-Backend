import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { connectMongoDB } from "./connection/db.js"
//import { logReqRes } from './middleware/log.js';
import MFroutes from "./routes/Routers.js"

dotenv.config();

const app = express()
//Middleware
//app.use(logReqRes("log.txt"))

const corsOptions = {
  origin: '*', //http://localhost:5173
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH',], 
  credentials: true, 
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cors(corsOptions))
app.use(cookieParser())

//database connection
connectMongoDB().then(()=>{console.log("connect to MongoDB")});

//Route
app.use("/api", MFroutes);
app.use("/",(req, res) => res.json({msg: "server start"}));


// const PORT = process.env.PORT || 5000
// app.listen(PORT, ()=> console.log(`server start at ${PORT}`))

export default app;