const CustomAPIErorr = require("./custom-api");
const { StatusCodes } = require("http-status-codes");

class UnAuthorizedError extends CustomAPIErorr {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}
module.exports = UnAuthorizedError;
