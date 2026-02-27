const userModel  = require("../models/authModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// Generate JWT Token
const generateToken = (id, name, role) => {
  return jwt.sign(
    { id, name, role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// 1. User Sign Up
const signup = async (req, res, next) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // CHECK EXISTING USER
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE USER
    const newUser = await userModel.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: "user",
    });

    // GENERATE TOKEN
    const token = generateToken(
      newUser._id,
      newUser.name,
      newUser.role
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        mobile: newUser.mobile,
        role: newUser.role,
      },
    });

  } catch (err) {
    console.error(err);
    next(err);
  }
};

// 2. User Login
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(
      user._id,
      user.name,
      user.role
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};


const verify = async (req, res) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Not authorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.status(200).json({
      status: true,
      user: decoded, // { id, name, role }
    });
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: "Invalid token",
    });
  }
};

// 3. User Logout
const logout = async (req, res, next) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      maxAge: 0
    });

    res.status(200).json({
      message: "User logged out successfully"
    });
  } catch (err) {
    next(err);
  }
};

// GET ALL USERS
const getAllUsers = async (req, res) => {
  const users = await userModel.find().select("-password");
  res.json(users);
};

// UPDATE USER ROLE
const updateUserRole = async (req, res) => {
  const { role } = req.body;

  const user = await userModel.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select("-password");

  res.json(user);
};

// DELETE USER
const deleteUser = async (req, res) => {
  await userModel.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};

// Export controllers
module.exports = {
  signup,
  login,
  logout,
  verify,
  getAllUsers,
  updateUserRole,
  deleteUser

};