require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./controllers/users");
const authRoutes = require("./controllers/auth");
const roomRoutes = require("./controllers/rooms");
const notifRoutes = require("./controllers/notifications");
const { initSocket } = require("./controllers/socket");  // Import the initSocket function

// Database connection
connection();

const app = express();
const server = http.createServer(app);
const io = initSocket(server);  // Initialize Socket.IO server

// Middlewares
app.use(express.json());
app.use(cors({ origin: "http://192.168.176.165:3000", credentials: true }));
app.use(express.urlencoded({ extended: false }));
app.set("view engine","ejs");

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/notifications", notifRoutes);





// Serve static files from the 'uploads' folder
app.use('/uploads', express.static('uploads'));

// Route for the root path
app.get("/", (req, res) => {
  res.send("Welcome to the home page!");
});

// Start server
const port = process.env.PORT || 8080;
server.listen(port, '192.168.176.165',() => console.log(`Listening on port ${port}...`));

module.exports = { io };
