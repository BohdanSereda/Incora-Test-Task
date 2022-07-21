const ApiError = require("../error/apiError");

module.exports = function (err, req, res, next) {
    console.error(err);
    if (err instanceof ApiError) {
        return res
            .status(err.status)
            .send({ message: err.message, errors: err.errors });
    }
    return res.status(500).send({ message: "Server errors" });
};
