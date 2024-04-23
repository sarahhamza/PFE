const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['controlleur', 'femme de menage'], required: true },
    accept: { type: Number, default: 0 },
    image: { type: String },
    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }] ,// Tableau des ID des chambres
    archived: { type: Boolean, default: false }

});


userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
        expiresIn: "7d",
    });
    return token;
};

const User = mongoose.model("user", userSchema);

const validate = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required().label("First Name"),
        lastName: Joi.string().required().label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
        role: Joi.string().valid('controlleur', 'femme de menage').required().label("Role"),
        accept: Joi.number().default(0).label("Accept"),
        image: Joi.string().label("Image").allow(null, ''),

    });
    return schema.validate(data);
};

module.exports = { User, validate };

