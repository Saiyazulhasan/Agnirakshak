const {WebSocketServer} = require("ws");

let wss;

function createWebSocketServer(server) {
    wss = new WebSocketServer({ server ,
        path: "/ws"
    });

    wss.on("connection",(socket)=>{
        console.log("frontend connected via websocket");

        socket.send(JSON.stringify({
            type:"connected",
            message:"websocket connected"
        }));
    });
    return wss;
}


function broadcast (data){
    if(!wss) return;

    const message = JSON.stringify(data);

    wss.clients.forEach((client)=>{
        if(client.readyState === 1){
            client.send(message);
        }
    });
}


module.exports ={
    createWebSocketServer,
    broadcast
};