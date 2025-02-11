var express = require("express");
var http = require("http");
//var path = require('path');
var socket = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use(express.static(__dirname + "/public"));

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    io.emit("chat message", socket.user + " disconnected!");
    console.log(socket.user + " disconnected");
  });

  socket.on("start", (user) => {
    socket.user = user;

    io.emit("chat message", "server", socket.user + " connected");
    console.log(socket.user + " connected");
  });
  socket.on("chat message", (msg) => {
    console.log(socket.user + " : " + msg);
    io.emit("chat message", socket.user, msg);
  });
  socket.on("file share", (msg) => {
    console.log(socket.user + " : " + msg);
    io.emit("file share", socket.user, msg);
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
