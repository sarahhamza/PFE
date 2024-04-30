const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


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
            return res.status(401).send({ message: "Veuillez attendre l'acceptation" });

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
        res.status(200).json(user);

    } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.name === 'JsonWebTokenError' || error.name === 'SyntaxError') {
            return res.status(401).json({ message: "Invalid token" });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
});
module.exports = router;
