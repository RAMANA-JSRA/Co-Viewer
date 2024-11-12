require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const Redis = require("ioredis");

const PORT = process.env.PORT || 4000;
const redis = new Redis(process.env.REDIS_URL);
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow cross-origin requests
    methods: ["GET", "POST"],
  },
});

let currentPage = 1;
let adminId = null;

app.use(cors({ origin: "http://192.168.205.18:4000" }));
app.get("/", (req, res) => res.send("PDF Co-Viewer Server is Running!"));

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Assign admin if none exists
  if (!adminId) adminId = socket.id;

  // Emit initial page and role information
  socket.emit("current-page", {
    page: currentPage,
    isAdmin: socket.id === adminId,
  });

  // Handle page changes by the admin
  socket.on("change-page", (page) => {
    if (socket.id === adminId) {
      currentPage = page;
      io.emit("page-changed", page);
    }
  });

  // Handle disconnections and admin reassignment
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    if (socket.id === adminId) {
      adminId = null;
      const [nextAdmin] = io.sockets.sockets.keys();
      adminId = nextAdmin || null;
      if (adminId) io.to(adminId).emit("admin-assigned");
    }
  });
});

server.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on http://192.168.205.18:${PORT}`)
);
