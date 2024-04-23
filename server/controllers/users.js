const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const xlsx = require("xlsx");
const { Room } = require("../models/room");



// Set storage engine
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `user_image_${Date.now()}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sarahhm31@gmail.com',
    pass: 'sjqr puky jshy uxvz'
  }
});

router.post("/", upload.single('image'), async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(409).send({ message: "User with given email already exists!" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashPassword,
      role: req.body.role,
      accept: req.body.accept,
      image: req.file ? req.file.filename : null,
      rooms: req.body.rooms // Add the rooms field
    });

    await newUser.save();
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    console.error('Error saving user to database:', error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

//get user
router.get("/", async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find({ archived: { $ne: true } }, '-password'); // Exclude the password field from the response
    res.status(200).send(users);
  } catch (error) {
    console.error('Error fetching users from the database:', error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

//put user
router.put("/:userId/accept", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    user.accept = 1;
    const mailOptions = {
      from: '@gmail.com',
      to: user.email,
      subject: 'Account Accepted',
      text: 'Congratulations! Your account has been accepted.'
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error('Error sending email:', error);
        res.status(500).send({ message: "Error sending email" });
      } else {
        console.log('Email sent: ' + info.response);

        user.save()
          .then(() => {
            res.status(200).json({ message: "User accept status updated successfully" });
          })
          .catch((saveError) => {
            console.error('Error saving user:', saveError);
            res.status(500).json({ message: "Error saving user" });
          });
      }
    });
  } catch (error) {
    console.error('Error updating user accept status:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//delete user
router.delete("/:userId/delete", async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.userId);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.put("/:userId", upload.single('image'), async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = req.body;

    if (req.file) {
      userData.image = req.file.filename;
    }

    // Update user data in the database
    await User.findByIdAndUpdate(userId, userData);

    res.status(200).send({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
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

    // Process and validate each row of data
    const processedData = [];
    for (const item of jsonData) {
      console.log("Processing item:", item);

      // Validate each item
      const { error } = validate(item);
      if (error) {
        console.error("Validation error:", error.details[0].message);
        // Skip invalid data
        continue;
      }

      // Log extracted values for debugging
      console.log("Extracted values:", {
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.email,
        role: item.role,
        // Add more fields as needed
      });

      // Create a new user object
      const newUser = new User({
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.email,
        password: item.password,
        role: item.role,
        accept: item.accept,
        image: item.image,
      });

      // Save the user to the database
      await newUser.save();
      processedData.push(newUser);
    }

    // Log processed data for debugging
    console.log("Processed data:", processedData);

    res.status(200).send({ message: "Data imported successfully", processedData });
  } catch (error) {
    console.error("Error importing data:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});
// Update user and assign room
router.put("/:userId/assign-room/:roomId", async (req, res) => {
  try {
    const { userId, roomId } = req.params;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Assign the room to the user
    user.rooms.push(roomId); // Assuming rooms is an array field in the user model
    await user.save();

   
    const room = await Room.findById(roomId);
    room.User = userId;
    await room.save();

    res.status(200).send({ message: "Room assigned to user successfully" });
  } catch (error) {
    console.error('Error assigning room to user:', error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});


module.exports = router;