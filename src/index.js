require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.use(errorMiddleware);

const start = async () => {
    try {
        app.listen(port, () => console.log(`Server started on PORT = ${port}`));
    } catch (err) {
        console.log(err);
    }
};
start();
