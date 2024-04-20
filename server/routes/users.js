const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');

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
    const users = await User.find({}, '-password'); // Exclude the password field from the response
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
      from: 'sarahhm31@gmail.com',
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


module.exports = router;
