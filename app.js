const express = require('express');
const app = express();
const path = require('path');


const http = require('http');

const socket = require("socket.io");
const server = http.createServer(app);
const io = socket(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
    socket.on("send-location", function (data) {
        io.emit("receive-location", {id: socket.id, ...data});
    });
    socket.on("disconnect", function () {
        io.emit("user-disconnected", socket.id);
    });
})

app.get("/", function (req, res) {
    
    res.render("index");
})


const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});