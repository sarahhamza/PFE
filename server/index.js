require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./controllers/users");
const authRoutes = require("./controllers/auth");
const roomRoutes = require("./controllers/rooms");
const notifRoutes = require("./controllers/notifications");



// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(400).send({ error: err.message });
 });

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/notifications", notifRoutes);



// Serve static files from the 'uploads' folder
app.use('/uploads', express.static('uploads'));

// route for the root path
app.get("/", (req, res) => {
  res.send("Welcome to the home page!");
});

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
