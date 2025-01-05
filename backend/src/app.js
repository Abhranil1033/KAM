import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser"

const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(express.json())
app.use(express.urlencoded({extended : true}));
app.use(express.static("public"))
app.use(cookieParser());


// routes import
import userRouter from './routes/user.routes.js'
import leadRouter from "./routes/restaurant.routes.js";
import pocRouter from "./routes/poc.routes.js";
import callTrackRouter from "./routes/track.routes.js"

//routes declaration
app.use("/api/v1/",userRouter);
app.use("/api/v1/",leadRouter);
app.use("/api/v1/",pocRouter);
app.use("/api/v1/",callTrackRouter);


export {app};