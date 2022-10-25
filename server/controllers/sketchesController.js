const { StatusCodes } = require("http-status-codes");
const SketchModel = require("../models/Sketch");

/**
 * Save Sketches
 * @param {Object} req
 * @param {Object} res Response Object
 * @param {Function} next
 */
const saveSketches = async (req, res, next) => {
    try {
        const data = req.body;
        const isExsistingSketch = await SketchModel.findOne({
            name: data.name,
        });
        if (!isExsistingSketch) {
            const {
                name,
                sketchData: { lines, users },
            } = data;
            const sk = await SketchModel.create({ name, lines, users });
        } else {
            const { name, sketchData: line } = data;
            if (Object.keys(line).length >= 2) {
                const sk = await SketchModel.findOneAndUpdate(
                    { name: name },
                    { $push: { lines: line } },
                    { new: true, upsert: true }
                );
            }
        }
        return res.status(StatusCodes.OK).json({
            message: "Saved sketch",
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get Sketches
 * @param {Object} req
 * @param {Object} res Response Object
 * @param {Function} next
 */
const getSketches = async (req, res, next) => {
    const { onlynames, name } = req.query;
    try {
        if (onlynames) {
            // to get only names of sketches
            const sketches = await SketchModel.find({}).select({
                name: 1,
                _id: 0,
            });
            res.status(StatusCodes.OK).json({ data: sketches });
        } else if (name) {
            // get the perticular sketch
            const sketch = await SketchModel.findOne({ name: name });
            res.status(StatusCodes.OK).json({ data: sketch });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { getSketches, saveSketches };
