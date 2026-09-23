const mqtt = require ("mqtt");
const Telemetry = require("../models/telemetry");
const brokerUrl =process.env.MQTT_BROKER_URL ||
"mqtt://localhost:1883";

const topic =process.env.MQTT_TOPIC || "fire/v1/+/+/telemetry";

const mqttClient = mqtt.connect(brokerUrl);
mqttClient.on("connect",() =>{
    console.log("connected to Mosquito");

    mqttClient.subscribe(topic,(error)=>{
        if(error){
            console.error("MQTT subscrition failed:",error);
            return;
        }
        console.log(`Subscribed to:${topic}`);
    });
});

mqttClient.on("message",async(topic,message)=>{
    try{
        const data = JSON.parse(message.toString());
        console.log("\n--- MQTT DATA RECCEIVED ---");
        console.log("Topic:",topic);
        console.log("Data:",data);

        const savedTelemetry =await Telemetry.create({
            nodeId:data.nodeId,
            temperature:data.temperature,
            smoke :data.smoke,
            flame:data.flame,
            ts:data.ts || Date.now()
        });
        console.log("Telemetry saved to MongoDB:", savedTelemetry._id);
    }catch(error){
        console.error("invalid MQTT message:",error.message);
    }
});

mqttClient.on("error",(error)=>{
    console.error("MQTT error:",error.message);
});


module.exports = mqttClient
