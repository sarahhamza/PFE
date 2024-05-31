const mongoose = require("mongoose");
const Joi = require("joi");

const roomSchema = new mongoose.Schema({
    nbrRoom: { type: Number, required: true },
    Surface: { type: Number, required: true },
    Categorie: { type: String, required: true },
    State: { type: String, required: true },
    User: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    Property: { type: String, required: true },
    image: { type: String },
    archived: { type: Boolean, default: false },
    type: { type: String, enum: ['ToClean', 'ToReclean'], default: 'ToClean' }
});

const Room = mongoose.model("Room", roomSchema);

const validate = (data) => {
    const schema = Joi.object({
        nbrRoom: Joi.number().required().label("Number of Rooms"),
        Surface: Joi.number().required().label("Surface"),
        Categorie: Joi.string().required().label("Category"),
        State: Joi.string().allow(null, '').label("State"),
        User: Joi.string().allow(null, '').label("User"),
        Property: Joi.string().allow(null, '').label("Property"),
        image: Joi.string().label("Image").allow(null, ''),
        type: Joi.string().valid('ToClean', 'ToReclean').label("Type")
    });
    return schema.validate(data);
};

module.exports = { Room, validate };
