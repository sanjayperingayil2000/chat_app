// server code goes here....

const express = require("express")
const socket = require("socket.io")
const path = require("path")

const app = express()

app.use(express.static(path.join(__dirname,'/public')))

app.get('/', function(req,res){
    res.sendFile(__dirname + '/public/index.html')
})

const server = app.listen(6060, ()=>{
    console.log("Server is running at 8000")
})

const io = socket(server, {cors:{origin:"*"}});
let name;
let userArray = [];

io.on("connection", (socket) => {
    console.log("User is connected")
    socket.on("joining chat", (username) => {
       name = username;
       const user = {
        id: socket.id,
        name:name,       
    }
    userArray.push(user)
    console.log("All user joined => ",userArray);
       io.emit("chat message", `🎖️------${name} has joined the chat-------🍾`)
    })

    socket.on("disconnect", () => {
        console.log("Printing the user on disconnect => "),socket.id;
        const removedUser = userArray.map((user) => {
            if(socket.id === user.id){
                return user
            } 
        })
        console.log("User has been left the conversation",removedUser)
        io.emit("chat message",`-----${removedUser.name} has left the chat -----🙈`)
    })

    socket.on("chat message", (message) => {
        socket.broadcast.emit("chat message", message);
    })
    
})