const express = require("express");
const app = express();
const users = require("./MOCK_DATA.json");
const fs = require("fs");

const port = 8080;

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
app.get("/users", (req, res) => {
  const html = `
    <h1>Here are the List of Users </h1>
    <ul>
     ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
  res.send(html);
});

// Routes
app.get("/api/users", (req, res) => {
  res.setHeader("X-Myname", "Yogesh")  // Custom Header
  // Always add X to Custom Headers 
  console.log(req.headers);
  return res.json(users);
});

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    if(!user){
      return res.status(404).json({msg : "404 Not Found"});
    }
    return res.json(user);
  })
  .patch((req, res) => {
    const id = Number(req.params.id);
    const body = req.body;
    const userIndex = users.findIndex((user) => user.id === id);
    const gotUser = users[userIndex];
    const updateUser = { ...gotUser, ...body };

    users[userIndex] = updateUser;
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
      return res.json({ status: "Success", updateUser });
    });
  })
  .delete((req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
      users.pop(index);
    }
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
      return res.json({ status: "Successfully Removed" });
    });
  });

  // Created a New User in the MOCK_DATA.json File!
app.post("/api/users", (req, res) => {
  const body = req.body;
  if(!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title){
    return res.status(400).json({msg : "All Fields are Required..."});
  }
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.status(201).json({ status: "Success", id: users.length });
  });
});

app.listen(port, () => console.log(`Server Started at ${port} Successfully`));
