const User = require("../models/User");
const bcrypt = require("bcrypt");

const defaultUsers = [
  {
    firstname: "John",
    lastname: "Doe",
    username: "johndoe",
    password: "password123",
    type: "Writer",
    status: "Active",
  },
  {
    firstname: "Jane",
    lastname: "Smith",
    username: "janesmith",
    password: "password123",
    type: "Editor",
    status: "Active",
  },
];

const seedUsers = async () => {
  try {
    for (const user of defaultUsers) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    await User.bulkCreate(defaultUsers, { ignoreDuplicates: true });
    console.log("Default users created.");
  } catch (error) {
    console.error("Error creating default users:", error);
  }
};

module.exports = seedUsers;
