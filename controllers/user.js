const User = require("../models/user");

async function handleGetAllUsers(req, res) {
  const Alldbusers = await User.find({});
  const html = `
  <ul>
  ${Alldbusers.map(
    (user) => `<li><h1>${user.firstName} - ${user.email}</h1></li>`
  ).join(" ")} 
  </ul>`;
  return res.send(html);
}

async function handleGetUserById(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ msg: "404 Not Found" });
  }
  return res.json(user);
}

async function handleUpdateUserById(req, res) {
  await User.findByIdAndUpdate(req.params.id, { lastName: "Rawat" });
  return res.json({ status: "Success" });
}

async function handleDeleteUserById(req, res) {
  await User.findByIdAndDelete(req.params.id);
  return res.json({ status: "Success" });
}

async function handleCreateNewUser(req, res) {
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
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    jobTitle: body.job_title,
  });
  console.log("result", result);

  return res.status(201).json({ msg: "Success", id: result._id });
}

module.exports = {
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleCreateNewUser,
};
