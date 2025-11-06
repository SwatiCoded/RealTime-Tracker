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
app.use(express.urlencoded({ extended: true }));

io.on("connection", function (socket) {
    socket.on("send-location", function (data) {
        io.emit("receive-location", {id: socket.id, ...data});
    });
    socket.on("disconnect", function () {
        io.emit("user-disconnected", socket.id);
    });
})

// Device page: shares location only
app.get("/", function (req, res) {
    res.render("index");
})

// Admin page: view all locations
app.get("/admin", function (req, res) {
    res.render("admin");
})


const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});