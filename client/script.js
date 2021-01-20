const socket = io("http://localhost:3000/", { transports: ["websocket"] });
console.log("hello world!");

document.getElementById("createRoom").addEventListener("submit", createRoom);
document.getElementById("joinRoom").addEventListener("submit", joinRoom);
let createInput = document.getElementById("createInput")
let joinInput = document.getElementById("joinInput")

function createRoom(e) {
  e.preventDefault();
  let createdRoomName = createInput.value
  //console.log(form)
  socket.emit('create', createdRoomName)
}
