import 'dotenv/config'
import express from "express";
import bodyParser from 'body-parser'
const app = express();
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

const PORT = process.env.PORT || 8000
// Middlewares
app.use(bodyParser.json({limit:'30mb',extended:true}))
app.use(bodyParser.urlencoded({limit:'30mb',extended:true}))
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());

// Database connection
import { dbConnection } from "./src/config/db.js";
dbConnection()

// Routers
import AuthRoute from './src/routers/AuthRouter.js'
app.use('/auth',AuthRoute)


app.get('/',(req,res)=>{
     res.json({
        message:"You have reached the admin api"
     })
})

// Global error handling
app.use((err,req,res,next)=>{
    console.log(err)
    res.status(err.status || 404)
    res.json({
        status:'error',
        message:err.message
    })
})

app.listen(PORT,ERROR=>{
    ERROR && console.log(ERROR)
    console.log(`Your server is running on PORT:${PORT}`)
})

