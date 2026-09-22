const mongoose =require("mongoose");

async function connectDatabase(){
    const url =process.env.MONGODB_URI;
    if (!url){
        throw new Error("MONGODB_URL is missing");
    }
    await mongoose.connect(url);
    console.log("MongoDB connected");
}
module.exports=connectDatabase