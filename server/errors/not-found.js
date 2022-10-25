const CustomAPIErorr = require("./custom-api");
const { StatusCodes } = require("http-status-codes");

class NotFoundError extends CustomAPIErorr {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}
module.exports = NotFoundError;
