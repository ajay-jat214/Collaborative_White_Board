const express = require("express");
const http = require("http");
const app = express();
const httpServer = http.createServer(app);
const PORT = 3001 || process.env.PORT;
const {Server} = require("socket.io");
const io = new Server(httpServer);

let usersCanvas=[];
let connectedUsers = [],joinedUsers=0;

io.on("connection",(socket)=>{

  socket.on("join",({name,email},callback)=>{

    let userExists=false;

    socket.join(email);
    connectedUsers[email]=socket;

  });

  socket.on("sharingCanvas",({email,x0,y0,x1,y1,color},callback)=>{
    socket.broadcast.emit("sharedCanvas",{x0,y0,x1,y1,color});
  });
});

httpServer.listen(PORT,"0.0.0.0",()=>console.log(`Server is live on port ${PORT}`));
