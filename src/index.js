require("dotenv").config();
const express = require("express");
const sequelize = require("./database/db");
const userRouter = require("./routers/user-router");
const userModel = require("./models/user-model");
const errorMiddleware = require("./middleware/error");
const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(userRouter);
app.use(errorMiddleware);
const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(port, () => console.log(`Server started on PORT ${port}`));
    } catch (err) {
        console.log(err);
    }
};
start();
