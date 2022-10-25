const mongoose = require("mongoose");

//connect to mongodb server
const connectDB = () => {
    return mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

module.exports = connectDB;
