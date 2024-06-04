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
    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
    archived: { type: Boolean, default: false },
    phone: { type: String }, // New attribute
    address: { type: String }, // New attribute
    country: { type: String }, // New attribute
    gender :{type: String, enum: ['Female', 'Male']},
    postalcode:{type: Number},
    cin:{type: Number},
    birthdate:{type:Date},
 
} , { timestamps: true });

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
        phone: Joi.string().label("Phone").allow(null, ''), // New validation
        address: Joi.string().label("Address").allow(null, ''), // New validation
        country: Joi.string().label("Country").allow(null, '') ,// New validation
        gender: Joi.string().label("Gender").allow(null, '') ,// New validation
        cin: Joi.number().label("CIN").allow(null, ''),
        postalcode: Joi.number().label("Postal Code").allow(null, ''),
        birthdate: Joi.string().label("Birth Date").allow(null, '')

    });
    return schema.validate(data);
};

module.exports = { User, validate };
