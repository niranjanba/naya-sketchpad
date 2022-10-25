const mongoose = require("mongoose");

const sketchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "sketch name is required"],
    },
    users: Object,
    lines: [{ color: String, points: Object }],
});

const SketchModel = mongoose.model("Sketch", sketchSchema);
module.exports = SketchModel;
