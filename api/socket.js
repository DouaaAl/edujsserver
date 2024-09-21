import { Server } from "socket.io";
import http from "http"; 

const httpServer = http.createServer();

const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

let onlineUsers = [];


io.on("connection", (socket) => {

    socket.on("newUser", (userId)=>{
            onlineUsers = onlineUsers?.filter((item)=> item.userId != userId);
            onlineUsers.push({userId: userId, socketId: socket.id});
            io.emit("getAllLiveUsers", onlineUsers);
    })

    socket.on("message", (data)=>{
        onlineUsers.forEach((user) =>{
            if(user.userId == data.receiverId){
                console.log("selected users:",user, data.receiverId);
                io.to(user.socketId).emit("message", "realtime message")
            }
        })
    })

    socket.on("connectedUsers", ()=>{
        io.emit("getAllLiveUsers", onlineUsers);
    })

    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter((item)=>{
            return item.socketId != socket.id;
        })
        io.emit("getAllLiveUsers", onlineUsers);
    });
});

httpServer.listen(5001, () => {
    console.log("Server is working on port 3001");
});