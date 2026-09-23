const mongoose =require("mongoose");

const telemetrySchema = new
mongoose.Schema(
    {
    nodeId:{
        type: String,
        required: true,
        index : true
    },
    temperature:{
        type : Number,
        required: true
    },
     smoke:{
        type : Number,
        required: true
    },
     flame:{
        type : Boolean,
        required: true
    },
     ts:{
        type : Number,
        required: true,
        index:true
    }
},
    {
        timestamp: true
    }
);
module.exports =mongoose.model("Telemetry",telemetrySchema);