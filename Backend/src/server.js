require ("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDatabase = require("./config/database");

const app =express();

app.use(cors());
app.use(express.json());


app.get ("/health",(req,res)=>{
    res.json({
        status:"ok",
        message :"Agnirakshak backend is running"
    });
});


const PORT = process.env.PORT||4000;

async function startServer(){
    try{
        await connectDatabase();

        app.listen(PORT,()=>{
            console.log(`Backend running on http:localhost:${PORT}`);
        });
    } catch (error){
        console.error("failed to start server:",error.message);
        process.exit(1);
    }
}

startServer();