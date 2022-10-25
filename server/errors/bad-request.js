const CustomAPIErorr = require("./custom-api");
const { StatusCodes } = require("http-status-codes");

class BadRequestError extends CustomAPIErorr {
    constructor(message) {
        console.log("bad req");
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}
module.exports = BadRequestError;
