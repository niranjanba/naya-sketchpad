class CustomAPIErorr extends Error {
    constructor(message) {
        console.log("api error");
        super(message);
    }
}

module.exports = CustomAPIErorr;
