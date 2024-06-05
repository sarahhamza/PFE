const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { Room } = require("../models/room");
const nodemailer = require('nodemailer');
require("dotenv").config();

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sarahhm31@gmail.com',
      pass: 'sjqr puky jshy uxvz'
    }
  });
  

router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(401).send({ message: "Invalid Email or Password" });

        // Vérification du champ accept
        if (user.accept === 0)
            return res.status(401).send({ message: "Account not accepted yet" });

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!validPassword)
            return res.status(401).send({ message: "Invalid Email or Password" });

        // Generating JWT token with user ID in the payload
        const token = user.generateAuthToken();
        res.status(200).send({ data: token, message: "logged in successfully" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(data);
};
router.get("/user", async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        console.log(process.env.JWTPRIVATEKEY)
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
        console.log(decoded);
        const userId = decoded._id;
          // Ensure userId is valid before querying the database
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        // Get user data from the database using userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.accept!== 1) {
            return res.status(403).json({ message: "Account not accepted yet" });
        }
        res.status(200).json(user);

    } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.name === 'JsonWebTokenError' || error.name === 'SyntaxError') {
            return res.status(401).json({ message: "Invalid token" });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
});
router.get("/user-rooms", async (req, res) => {
    try {
      const token = req.header('Authorization').replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
      const userId = decoded._id;
  
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
  
      const rooms = await Room.find({ User: userId });
      res.status(200).json(rooms);
    } catch (error) {
      console.error("Error fetching user rooms:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });


router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    try {
      const oldUser = await User.findOne({ email });
      //console.log(oldUser);
      if (!oldUser) {
        return res.json({ status: "User Not Exists!!" });
      }
      const secret = process.env.JWTPRIVATEKEY + oldUser.password;
      const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
        expiresIn: "10m",
      });
      
      const link = `http://localhost:8080/api/auth/reset-password/${oldUser._id}/${token}`;
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: 'sarahhm31@gmail.com',
            pass: 'sjqr puky jshy uxvz'
          }
      });
  
      var mailOptions = {
        from: "sarahm31@gmail.com",
        to: oldUser.email,
        subject: "Password Reset",
        text: link,
      };
  
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      console.log(link);
    }  catch (error) {
        console.error("Error generating forgot password token:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
  });

router.get("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    console.log(req.params);
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = process.env.JWTPRIVATEKEY + oldUser.password;
    try {
      const verify = jwt.verify(token, secret);
      res.render("index", { email: verify.email, status: "Not Verified" });
      //res.send("Verified")
    } catch (error) {
      console.log(error);
      res.send("Not Verified");
    }
  });

router.post("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;
  
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret =  process.env.JWTPRIVATEKEY + oldUser.password;
    try {
      const verify = jwt.verify(token, secret);
      const encryptedPassword = await bcrypt.hash(password, 10);
      await User.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            password: encryptedPassword,
          },
        }
      );
  
      res.render("index", { email: verify.email, status: "verified" });
    } catch (error) {
      console.log(error);
      res.json({ status: "Something Went Wrong" });
    }
  });

  router.post("/change-password/:id", async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    try {
        // Fetch user from the database
        const user = await User.findById(id);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the provided current password matches the user's password
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Incorrect current password" });
        }

        // Update user's password with the new password
        user.password = newPassword;
        await user.save();

        // Send a success response
        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error("Error updating password:", error);
        return res.status(500).json({ message: "Failed to update password" });
    }
});
module.exports = router;
