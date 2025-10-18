import express from "express"
import dotenv from "dotenv"
import authRouter from "./router/authRoute.js";
import databaseConnect from "./config/databaseConfig.js";
import cookieParser from 'cookie-parser'

dotenv.config()
const app = express();

databaseConnect();

app.use(express.json());
app.use(cookieParser());


// app.use('/',(req,res) => {
//     res.status(200).json({data: "This is Home Page"})
// })

app.use('/api/auth/',authRouter)

export default app;