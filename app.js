import express from "express";
import http from "http";
import { Server } from "socket.io";
import bodyParser from "body-parser";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/select-service", (req, res) => {
    res.render("select-service");
});

app.get("/video-call", (req, res) => {
    const { service, role } = req.query;

    // Generate a unique room name based on the service
    const roomName = `E-Doctor-${service}-Room`;

    // Render the video-call page with the room details
    res.render("video-call", { service, role, roomName });
});

// WebSocket Connection
io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("joinRoom", (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
        socket.to(room).emit("userJoined", "A new participant has joined the consultation.");
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

// Start Server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
