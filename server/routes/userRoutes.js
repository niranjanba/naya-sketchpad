const router = require("express").Router();
const {
    saveUser,
    getAllUsers,
    getUser,
} = require("../controllers/userController");

router.get("/", getUser).post("/", saveUser);
router.get("/all-users", getAllUsers);
module.exports = router;
