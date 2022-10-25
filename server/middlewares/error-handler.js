const { StatusCodes } = require("http-status-codes");

const errorHandler = (err, req, res, next) => {
    const customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        errorMsg: err.message || "Something went wrong",
    };

    if (err.name === "CastError") {
        customError.errorMsg = `Can not find the id ${err.value}`;
        customError.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }
    return res
        .status(customError.statusCode)
        .json({ message: customError.errorMsg });
};

module.exports = errorHandler;
