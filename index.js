const express = require("express");
const mongoose = require("mongoose");
const app = express();

const fs = require("fs");
const { type } = require("os");

const port = 8080;

// Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/Backend-app-1")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
  },
  jobTitle: {
    type: String,
  }
},
  {timestamps : true}
);

// Model
const User = mongoose.model("user", userSchema);

// Middleware - Plugin
app.use(express.urlencoded({ extended: false }));

// Custom Middleware
app.use((req, res, next) => {
  fs.appendFile(
    "log.txt",
    `\n${Date.now()} : ${req.ip} : ${req.method} : ${req.path}\n`,
    (err, data) => {
      next();
    }
  );
});

// Root Route
app.get("/users", async (req, res) => {
  const Alldbusers = await User.find({});
  const html = `
    <h1>Here are the List of Users </h1>
    <ul>
     ${Alldbusers.map((user) => `<li>${user.firstName} - ${user.email}</li>`).join("")}
    </ul>
    `;
  res.send(html);
});

// Routes
app.get("/api/users", async (req, res) => {
  const Alldbusers = await User.find({});
  return res.json(Alldbusers);
});

app
  .route("/api/users/:id")
  .get( async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "404 Not Found" });
    }
    return res.json(user);
  })
  .patch( async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, { lastName : "Gallagher"});
      return res.json({ status: "Success" });
  })
  .delete( async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ status: "Success" });
  });

// Created a New User in the MOCK_DATA.json File!
app.post("/api/users", async (req, res) => {
  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  ) {
    return res.status(400).json({ msg: "All Fields are Required..." });
  }
  const result = await User.create({
    firstName : body.first_name,
    lastName : body.last_name,
    email : body.email,
    gender : body.gender,
    jobTitle : body.job_title,
  });
  console.log("result", result);

  return res.status(201).json({ msg : "Success"});
});

app.listen(port, () => console.log(`Server Started at ${port} Successfully`));
