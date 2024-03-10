const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const multer = require('multer');
const path = require('path');

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
    });

    await newUser.save();
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    console.error('Error saving user to database:', error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});


router.get("/", async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find({}, '-password'); // Exclude the password field from the response
    res.status(200).send(users);
  } catch (error) {
    console.error('Error fetching users from the database:', error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});
router.put("/:userId/accept", async (req, res) => {
  try {
    // Vérifiez si l'utilisateur existe
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Mettez à jour l'attribut accept de l'utilisateur
    user.accept = 1; // Mettez la valeur appropriée ici (1 pour accepter, 0 pour refuser)
    await user.save();

    res.status(200).send({ message: "User accept status updated successfully" });
  } catch (error) {
    console.error('Error updating user accept status:', error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
