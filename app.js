const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);
const router = require('./routes/indexRouter');

app.set('views',__dirname+'/views');
app.set('view engine','hbs');

app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname+'/public'));

app.use('/',router);

let onlineUsers = [];

io.on("connection",(socket)=>{

    socket.on("online",(name)=>{
        socket.broadcast.emit("online",name+" has entered the chat!",name);
    });
    socket.on('send message',(msg)=>{
       io.emit('send message',msg);
    });
    socket.on('typing',(name)=>{
       socket.broadcast.emit('typing',`${name} is typing...`);
    });
    socket.on('not typing',()=>{
       socket.broadcast.emit('not typing');
    });
    socket.on('update user list',(name)=>{
        addUserToList(socket.id,name);
        io.emit('update user list',onlineUsers);
    });
    socket.on('disconnect',()=>{
        const removedUser = removeUserFromList(socket.id);
        const msg = `${removedUser.name} has left the chat!`;
        io.emit('update user list',onlineUsers,msg);
    });
});

function addUserToList(id,name){
    const userIndex = onlineUsers.findIndex((user) => user.name === name);
    if(userIndex !== -1){
        onlineUsers[userIndex] = {name,id};
    }else{
        onlineUsers.push({name,id});
    }
}
function removeUserFromList(id){
    const userToRemove = onlineUsers.find(user=> user.id === id);
    onlineUsers = onlineUsers.filter(user=> user.id !== id);
    return userToRemove;
}
server.listen(3000);