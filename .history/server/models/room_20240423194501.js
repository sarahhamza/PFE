const mongoose = require("mongoose");
const Joi = require("joi");

const roomSchema = new mongoose.Schema({
    nbrRoom: { type: Number, required: true },
    Surface: { type: Number, required: true },
    Categorie: { type: String, required: true },
    State: { type: String, required: true },
    User: { type: mongoose.Schema.Types.ObjectId, ref: 'User' ,default: null  }, // Change the type to ObjectId
    Property: { type: String, required: true },
    image: { type: String },
    archived: { type: Boolean, default: false } 
  });

const Room = mongoose.model("room", roomSchema);

const validate = (data) => {
    const schema = Joi.object({
        nbrRoom: Joi.number().required().label("Number of Rooms"),
        Surface: Joi.number().required().label("Surface"),
        Categorie: Joi.string().required().label("Category"),
        State: Joi.string().required().label("State"),
        User: Joi.string().label("User"), // Assuming User represents the cleaning staff
        Property: Joi.string().required().label("Property"),
        image: Joi.string().label("Image").allow(null, ''),
    });
    return schema.validate(data);
};

module.exports = { Room, validate };
