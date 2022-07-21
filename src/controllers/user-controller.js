const bcrypt = require("bcrypt");
const User = require("../models/user-model");
const ApiError = require("../error/apiError");
const jwt = require("jsonwebtoken");
class UserController {
    async createUser(req, res, next) {
        try {
            const { first_name, last_name, email, phone, password } = req.body;
            const hashPassword = await bcrypt.hash(password, 5);
            const user = await User.create({
                first_name,
                last_name,
                email,
                phone,
                password: hashPassword,
            });
            return res.json(user);
        } catch (err) {
            next(err);
        }
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });
            if (!user) {
                throw ApiError.badRequest(`User not found`);
            }
            const comparePassword = bcrypt.compareSync(password, user.password);
            if (!comparePassword) {
                throw ApiError.badRequest(`Incorrect password`);
            }
            const token = jwt.sign(
                { id: user.id, email },
                process.env.SECRET_KEY,
                { expiresIn: "24h" }
            );
            return res.json({ token });
        } catch (err) {
            next(err);
        }
    }
    async getUser(req, res, next) {
        try {
            const id = req.params.id;
            const user = await User.findByPk(id);
            if (!user) {
                throw ApiError.notFound(`User not found`);
            }
            return res.json(user);
        } catch (err) {
            next(err);
        }
    }
    async updateUser(req, res, next) {
        try {
            const id = req.params.id;
            const candidate = await User.findByPk(id);
            if (!candidate) {
                throw ApiError.notFound(`User not found`);
            }
            if (req.body.password) {
                req.body.password = await bcrypt.hash(req.body.password, 5);
            }
            const data = await User.upsert({ id, ...req.body });
            const user = data[0];
            return res.json(user);
        } catch (err) {
            next(err);
        }
    }
}
module.exports = new UserController();
