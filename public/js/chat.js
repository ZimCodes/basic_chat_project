const socket = io();
const input = document.querySelector("input");
const form = document.querySelector("form");
const chatLog = document.querySelector("#chatLog");
const onlineSidebar = document.querySelector('aside ul');
const storageKey = "chatName";
let timer;


form.addEventListener("submit",(e)=>{
    e.preventDefault();
    const msg = input.value;
    input.value = '';
    socket.emit("send message",msg);
});
input.addEventListener("keypress",(e)=>{
    socket.emit("typing",sessionStorage.getItem(storageKey));
    playTimer();
});
socket.on('typing', (msg)=>{
    const signal = document.querySelector('#signal > em');
    signal.textContent = msg;
});
socket.on('not typing',()=>{
    const signal = document.querySelector('#signal > em');
    signal.textContent = '';
});
socket.on('send message', (msg,name) =>{
    const {liNode, textNode} = createList(msg);
    const bNode = document.createElement('b');
    const nameTextNode = document.createTextNode(name+': ');
    bNode.appendChild(nameTextNode);
    liNode.append(bNode,textNode);
    chatLog.appendChild(liNode);
    window.scrollTo(0,document.body.clientHeight+chatLog.scrollHeight);
});

socket.on('connect',()=>{
    const name = sessionStorage.getItem(storageKey);
    socket.emit("online",name);
    socket.emit("update user list",name);
});

socket.on("online", (msg)=>{
    notifyMessage(msg);
});
socket.on("update user list",(users,msg)=>{
    setOnlineSidebar(users);
    if(msg){
        notifyMessage(msg);
    }
});
function createList(msg=''){
    const liNode = document.createElement('li');
    const textNode = document.createTextNode(msg);
    return {liNode,textNode};
}
function playTimer(){
    if(!timer) {
        timer = setTimeout(() => {
            socket.emit('not typing');
            timer = null;
        }, 1000);
    }
}
function setOnlineSidebar(users){
    onlineSidebar.replaceChildren();
    users.forEach(({name})=>{
        const {liNode,textNode} = createList(name);
        liNode.appendChild(textNode);
        onlineSidebar.appendChild(liNode);
    });
}
function notifyMessage(msg){
    const {liNode, textNode} = createList(msg);
    const smallNode = document.createElement('small');
    smallNode.appendChild(textNode);
    liNode.appendChild(smallNode);
    chatLog.appendChild(liNode);
}