require("dotenv").config();

const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/error-handler");
const notFound = require("./middlewares/not-found");
const connectDB = require("./db/connet");
const io = require("socket.io")(4001, {
    cors: { origin: ["http://localhost:3000"] },
});

const app = express();

const whitelist = ["http://localhost:3000"];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

// Routes
const sketchesRoute = require("./routes/sketch");
const userRoutes = require("./routes/userRoutes");

// sketches route
app.use("/api/v1/sketches", sketchesRoute);
// user route
app.use("/api/v1/user", userRoutes);

app.use(errorHandler);
app.use(notFound);

// ========== Socket IO ===========

io.on("connection", (socket) => {
    socket.on("send-new-sketch", (sketch) => {
        socket.broadcast.emit("receive-new-sketch", sketch);
    });
    socket.on("join-sketch", ({ toSketch, fromSketch }) => {
        socket.join(toSketch);
        if (fromSketch) {
            socket.leave(fromSketch);
        }
    });
    socket.on("send-new-line", ({ line, room }) => {
        socket.to(room).emit("receive-new-line", line);
    });
    socket.on("send-new-user", (user) => {
        socket.broadcast.emit("receive-new-user", user);
    });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    connectDB()
        .then(() => console.log("SERVER IS UP AND RUNNING"))
        .catch((err) => console.log(err.message));
});
