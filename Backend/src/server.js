require ("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDatabase = require("./config/database");
const mqttClient = require("./mqtt/client");

const { createWebSocketServer } = require("./websockets/server");
const telemetryRouter = require("./routes/telemetry");

const app =express();

app.use(cors());
app.use(express.json());


app.get ("/health",(req,res)=>{
    res.json({
        status:"ok",
        message :"Agnirakshak backend is running"
    });
});

app.use("/api/telemetry",telemetryRouter);

const PORT = process.env.PORT||4000;

async function startServer(){
    try{
        await connectDatabase();

        const server = app.listen(PORT,()=>{
            console.log(`Backend running on http://localhost:${PORT}`);
        });

        createWebSocketServer(server);

        console.log(`WebSocket server running on ws://localhost:${PORT}/ws`);
    } catch (error){
        console.error("failed to start server:",error.message);
        process.exit(1);
    }
}

startServer();