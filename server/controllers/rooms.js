const router = require("express").Router();
const { Room, validate } = require("../models/room");
const multer = require('multer');
const path = require('path');

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
      State: req.body.State || 'Not cleaned',
      User: req.body.User || null,
      Property: req.body.Property || null,
      image: req.file ? req.file.filename : null,
      type: req.body.type || 'ToClean'
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
//stat
router.get("/stats", async (req, res) => {
  try {
    const roomCount = await Room.countDocuments();
    const cleanCount = await Room.countDocuments({ Property: 'Clean' });
    const messyCount = await Room.countDocuments({ Property: 'Messy' });

    res.status(200).send({
      rooms: roomCount,
      clean: cleanCount,
      messy: messyCount
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});
// Route pour les 4 derniers utilisateurs ajoutés
router.get("/recent-rooms", async (req, res) => {
  try {
    const recentRooms = await Room.find({}).sort({ createdAt: -1 }).limit(4);
    res.status(200).send(recentRooms);
  } catch (error) {
    console.error('Error fetching recent users:', error);
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

router.get("/available", async (req, res) => {
  try {
    const availableRooms = await Room.find({ User: null });
    res.status(200).send(availableRooms);
  } catch (error) {
    console.error('Error fetching available rooms:', error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.put('/:roomId/image', upload.single('image'), async (req, res) => {
  const { roomId } = req.params;

  // Vérifier si l'ID de la salle est un ObjectId valide
  if (!roomId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).send({ message: 'Invalid room ID' });
  }

  try {
    // Vérifier si une image a été uploadée
    if (!req.file) {
      return res.status(400).send({ message: 'No image uploaded' });
    }

    // Trouver la salle par ID et mettre à jour le champ image
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).send({ message: 'Room not found' });
    }

    // Mettre à jour le chemin de l'image dans la salle
    room.image = req.file.filename;

    // Sauvegarder la salle mise à jour
    await room.save();

    res.status(200).send({ message: 'Image updated successfully', room });
  } catch (error) {
    console.error('Error updating room image:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

router.put("/:roomId/state", async (req, res) => {
  const { roomId } = req.params;
  const { State } = req.body;

  try {
    // Check if the room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Update the state of the room
    room.State = State;
    await room.save();

    res.status(200).json({ message: "Room state updated successfully", room });
  } catch (error) {
    console.error("Error updating room state:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/distribution", async (req, res) => {
  try {
    const roomStates = await Room.aggregate([
      { $match: { archived: { $ne: true } } },
      { $group: { _id: "$State", count: { $sum: 1 } } }
    ]);

    const distribution = roomStates.reduce((acc, state) => {
      acc[state._id] = state.count;
      return acc;
    }, { "Not cleaned": 0, "In progress": 0, "Cleaned": 0 });

    res.status(200).send(distribution);
  } catch (error) {
    console.error('Error fetching room states distribution:', error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});
router.put("/:roomId/state", async (req, res) => {
  const { roomId } = req.params;
  const { State } = req.body;

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    room.State = State;
    await room.save();

    res.status(200).json({ message: "Room state updated successfully", room });
  } catch (error) {
    console.error("Error updating room state:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = router;
