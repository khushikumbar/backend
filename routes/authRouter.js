const express = require("express");
const { signup, login, logout,verify, updateUserRole, deleteUser, getAllUsers} = require("../controllers/authController");

const { protectRoutes } = require("../utils/roleVerification");


const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/verify",protectRoutes,verify);
authRouter.post("/logout", protectRoutes, logout);
authRouter.get("/getuser", protectRoutes,getAllUsers);
authRouter.put("/update/:id", protectRoutes,updateUserRole);
authRouter.delete("/delete/:id", protectRoutes,deleteUser);

module.exports =authRouter