const express = require("express");
const app = express();
const users = require("./MOCK_DATA.json");
const fs = require("fs");

const port = 8080;

// Middleware - Plugin
app.use(express.urlencoded({extended : false}));

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
  return res.json(users);
});

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
  })
  .patch((req, res) => {
    const id = Number(req.params.id);
    const body = req.body;
    const userIndex = users.findIndex((user) => user.id === id);
    const gotUser = users[userIndex];
    const updateUser = {...gotUser,...body};

    users[userIndex] = updateUser;
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err , data) => {
        return res.json({ status: "Success", updateUser });
    });
  })
  .delete((req, res) => {
    const id = Number(req.params.id);
    const index  = users.findIndex((user) => user.id === id);
    if(index !== -1){
        users.pop(index);
    } 
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err , data) => {
        return res.json({ status: "Successfully Removed" });
    });
  });

app.post("/api/users", (req, res) => {
  const body = req.body;
  users.push({...body, id: users.length + 1});
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({ status: "Success", id: users.length });
  })
  
  
});

app.listen(port, () => console.log(`Server Started at ${port} Successfully`));
