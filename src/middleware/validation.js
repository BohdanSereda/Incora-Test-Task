const User = require("../models/user-model");
const validator = require("validator");
const ApiError = require("../error/apiError");
class validationHelper {
    validateFirstName(first_name, isUpdated) {
        if (isUpdated && !first_name) {
            return;
        }
        if (!first_name) {
            throw ApiError.badRequest(`First name is required`);
        }
        if (!validator.isAlpha(first_name)) {
            throw ApiError.badRequest(`First name is invalid:`);
        }
    }
    validateLastName(last_name, isUpdated) {
        if (isUpdated && !last_name) {
            return;
        }
        if (!validator.isAlpha(last_name)) {
            throw ApiError.badRequest(`Last name is invalid:`);
        }
    }
    validatePhoneNumber(phone, isUpdated) {
        if (isUpdated && !phone) {
            return;
        }
        let regexp =
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        /* 
            Valid formats:
            (123) 456-7890
            (123)456-7890
            123-456-7890
            123.456.7890
            1234567890
            +31636363634
            075-63546725 
        */
        if (!regexp.test(phone)) {
            throw ApiError.badRequest(`Phone number is invalid: ${phone}`);
        }
    }
    validateEmail = async (email, isUpdated) => {
        if (isUpdated && !email) {
            return;
        }
        if (!email) {
            throw ApiError.badRequest(`Email is required`);
        }
        const candidate = await User.findOne({ where: { email } });
        if (candidate) {
            throw ApiError.badRequest(
                `User with this email ${email} already exists`
            );
        }
        if (!validator.isEmail(email)) {
            throw ApiError.badRequest(`Email is invalid: ${email}`);
        }
    };

    validatePassword(password, isUpdated) {
        if (isUpdated && !password) {
            return;
        }
        if (!password) {
            throw ApiError.badRequest(`Password is required`);
        }
        if (password.length < 7) {
            throw ApiError.badRequest(
                `Password needs to be at least 7 characters`
            );
        }
    }

    validateUser = async (req, res, next) => {
        try {
            let isUpdated = false;
            let user = req.body;
            this.validateFirstName(user.first_name, isUpdated);
            this.validateLastName(user.last_name, isUpdated);
            this.validatePhoneNumber(user.phone, isUpdated);
            await this.validateEmail(user.email, isUpdated);
            this.validatePassword(user.password, isUpdated);
            next();
        } catch (err) {
            next(err);
        }
    };
    validateUserUpdates = async (req, res, next) => {
        try {
            let isUpdated = true;
            let updates = req.body;
            this.validateFirstName(updates.first_name, isUpdated);
            this.validateLastName(updates.last_name, isUpdated);
            this.validatePhoneNumber(updates.phone, isUpdated);
            await this.validateEmail(updates.email, isUpdated);
            this.validatePassword(updates.password, isUpdated);
            next();
        } catch (err) {
            next(err);
        }
    };
}
module.exports = new validationHelper();
