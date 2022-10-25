const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: String,
    color: String,
    name: String,
    firstName: String,
    lastName: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
