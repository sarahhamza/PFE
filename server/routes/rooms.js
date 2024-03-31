const router = require("express").Router();
const { Room, validate } = require("../models/room");
const bcrypt = require("bcrypt");
const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `room_image_${Date.now()}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

router.post("/", upload.single('image'), async (req, res) => {
  try {
    console.log('Request received:', req.body);

    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const room = new Room({
      nbrRoom: req.body.nbrRoom,
      Surface: req.body.Surface,
      Categorie: req.body.Categorie,
      State: req.body.State,
      User: req.body.User, // Use the user ID from the request body
      Property: req.body.Property,
      image: req.file ? req.file.filename : null,
    });

    await room.save();
    res.status(201).send({ message: "Room created successfully" });
  } catch (error) {
    console.error('Error saving room to database:', error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.status(200).send(rooms);
  } catch (error) {
    console.error('Error fetching rooms from the database:', error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.put("/:roomId/edit", async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.roomId, req.body, { new: true });
    if (!room) {
      return res.status(404).send({ message: "Room not found" });
    }
    res.status(200).send({ message: "Room updated successfully" });
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.delete("/:roomId", async (req, res) => {
  try {
    const room = await Room.findByIdAndRemove(req.params.roomId);
    if (!room) {
      return res.status(404).send({ message: "Room not found" });
    }
    res.status(200).send({ message: "Room deleted successfully" });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
