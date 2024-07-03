const express = require("express");
const { connectmongoDB } = require("./connection");

const { logReqRes } = require("./middlewares");

const userRouter = require("./routes/user");

const app = express();
const port = 8080;

// Connection to MongoDB
connectmongoDB("mongodb://127.0.0.1:27017/Backend-app-1").then(() => {
  console.log("MongoDB Connected!");
});

// Middleware - Plugin
app.use(express.urlencoded({ extended: false }));
app.use(logReqRes("log.txt"));

// Routes
app.use("/api/user", userRouter);

app.listen(port, () => console.log(`Server Started at ${port} Successfully`));
