require("dotenv").config();
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const sequelize = require("./database/db");
const userRouter = require("./routers/user-router");
const errorMiddleware = require("./middleware/error");
const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(userRouter);
app.use(errorMiddleware);

const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
    socket.on("updateUser", () => {
        socket.emit("pushNotification", user);
    });
});
const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        server.listen(port, () =>
            console.log(`Server started on PORT ${port}`)
        );
    } catch (err) {
        console.log(err);
    }
};
start();
