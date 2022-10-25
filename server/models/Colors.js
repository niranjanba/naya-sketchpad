const { Schema, model } = require("mongoose");

const colorSchema = new Schema({
    colors: [String],
});

const Color = model("Color", colorSchema);

module.exports = Color;
