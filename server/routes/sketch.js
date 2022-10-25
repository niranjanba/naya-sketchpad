const router = require("express").Router();
const {
    saveSketches,
    getSketches,
} = require("../controllers/sketchesController");

router.get("/", getSketches).post("/", saveSketches);

module.exports = router;
