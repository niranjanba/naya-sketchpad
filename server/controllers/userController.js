const { StatusCodes } = require("http-status-codes");
const Color = require("../models/Colors");
const User = require("../models/User");

/**
 * Get all users
 * @param {Object} req
 * @param {Object} res Response Object
 * @param {Function} next
 */
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        res.status(StatusCodes.OK).json({ users });
    } catch (error) {
        next(error);
    }
};

/**
 * Get Single User
 * @param {Object} req
 * @param {Object} res Response Object
 * @param {Function} next
 */
const getUser = async (req, res, next) => {
    try {
        const { email } = req.query;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(StatusCodes.OK).json({ user: user });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({
                message: "user not found",
            });
        }
    } catch (error) {
        next(error);
    }
};
/**
 * Save User and Generate random unique color and assign it to user
 * @param {Object} req
 * @param {Object} res Response Object
 * @param {Function} next
 */
const saveUser = async (req, res, next) => {
    try {
        const { email, firstName, lastName, displayName } = req.body.data;
        if (
            email &&
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
        ) {
            const user = await User.findOne({ email: email });
            if (!user) {
                let colors = await Color.find({});
                let randomColor;
                let newUser;
                // generate ramdomcolor which is not assigned to any user
                do {
                    randomColor = generateRandomColor();
                } while (colors.indexOf(randomColor) !== -1);
                if (firstName && lastName) {
                    newUser = await User.create({
                        email: email,
                        name: firstName + " " + lastName,
                        color: randomColor,
                        firstName,
                        lastName,
                    });
                } else {
                    newUser = await User.create({
                        email: email,
                        name: displayName,
                        color: randomColor,
                    });
                }
                if (colors.length) {
                    await Color.updateOne(
                        {},
                        { $push: { colors: randomColor } }
                    );
                } else {
                    await Color.create({ colors: randomColor });
                }
                res.status(StatusCodes.OK).json({ user: newUser });
            } else {
                res.status(StatusCodes.OK).json({ message: "user exist" });
            }
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Invalid fields",
            });
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Random color generator
 * @returns Randomly generated hex color
 */
function generateRandomColor() {
    const rangeSize = 100;
    const parts = [
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * rangeSize),
        Math.floor(Math.random() * rangeSize) + 256 - rangeSize,
    ].sort((a, b) => Math.random() < 0.5);

    return "#" + parts.map((p) => ("0" + p.toString(16)).substr(-2)).join("");
}

module.exports = { getAllUsers, saveUser, getUser };
