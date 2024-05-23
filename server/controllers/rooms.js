const router = require("express").Router();
const { Room, validate } = require("../models/room");
const multer = require('multer');
const path = require('path');
const xlsx = require("xlsx");
const { getIo } = require("../controllers/socket");

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
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const room = new Room({
      nbrRoom: req.body.nbrRoom,
      Surface: req.body.Surface,
      Categorie: req.body.Categorie,
      State: req.body.State,
      User: req.body.User || null,
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
    const rooms = await Room.find({ archived: { $ne: true } }); // Filter out archived rooms
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
router.post("/import", upload.single('file'), async (req, res) => {
  try {
      const file = req.file;
      if (!file) {
          return res.status(400).send({ message: "No file uploaded" });
      }

      // Read the uploaded Excel file
      const workbook = xlsx.readFile(file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert worksheet data to JSON format
      const jsonData = xlsx.utils.sheet_to_json(worksheet);

      // Process each row of data
      const processedData = jsonData.map(row => {
          // If User field is empty or "null", set it to null
          if (!row.User || row.User === "null") {
              row.User = null;
          }
          return row;
      });

      // Save processed data to the database
      await Room.insertMany(processedData);

      res.status(200).send({ message: "Data imported successfully" });
  } catch (error) {
      console.error("Error importing data:", error);
      res.status(500).send({ message: "Internal Server Error" });
  }
});
router.put('/:roomId', async (req, res) => {
  const { roomId } = req.params;

  try {
      // Find the room by ID
      const room = await Room.findById(roomId);

      if (!room) {
          return res.status(404).json({ error: 'Room not found' });
      }

      // Update the room's status to "Archived"
      room.archived = true;

      // Save the updated room
      await room.save();

      res.json({ message: 'Room archived successfully' });
  } catch (error) {
      console.error('Error archiving room:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});
router.get("/available", async (req, res) => {
  try {
    const availableRooms = await Room.find({ User: null });
    res.status(200).send(availableRooms);
  } catch (error) {
    console.error('Error fetching available rooms:', error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});
router.post('/:id/images/upload', upload.single('image'), async (req, res) => {
  try {
      // Check if a file was uploaded
      if (!req.file) {
          throw new Error('No file uploaded');
      }

      // Retrieve the room ID from the URL parameters
      const roomId = req.params.id;

      // Attempt to find and update the room document
      const result = await Room.findByIdAndUpdate(roomId, { image: req.file.filename }, { new: true });

      // Check if the update was successful
      if (!result) {
          throw new Error('Room not found');
      }

      // Send the updated room document back to the client
      res.send(result);
  } catch (error) {
      console.error('Error updating room:', error);
      res.status(500).send({ message: 'Error updating room' });
  }
});


module.exports = router;
