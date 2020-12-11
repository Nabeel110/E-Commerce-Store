const express = require("express");
const User = require("../models/userModel");
const router = express.Router();
const generateToken = require("../utils/generateToken");
const protect = require("../middleware/authMiddleware");
const { v4: uuid } = require("uuid");
const user = new User();

// match password

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    user.login(email, password, (result) => {
      if (result) {
        res.json({
          id: result.id,
          fname: result.fname,
          lname: result.lname,
          email: result.email,
          isAdmin: result.isAdmin,
          token: generateToken(result.id),
        });
      } else {
        res.status(401).json({
          message: "Email/password Invalid",
        });
      }
    });
  } else {
    res.status(401).json({
      message: "Enter valid Email/password.",
    });
  }
});

// @desc   Register a new user
// @route  POST /api/users/
// @access Public
router.post("/", async (req, res) => {
  let userInput = {
    id: uuid(),
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    fname: req.body.fname,
    lname: req.body.lname,
  };
  // console.log("UserInput", userInput);

  if (userInput.email !== "") {
    user.find(userInput.email, (foundUser) => {
      if (foundUser) {
        res.status(400).json({
          message: "User Already exist with this email.",
        });
      }
    });
  } else if (userInput) {
    user.create(userInput, (user) => {
      if (userInput) {
        console.log(userInput.id);
        res.status(201).json({
          id: userInput.id,
          username: userInput.username,
          fname: userInput.fname,
          lname: userInput.lname,
          email: userInput.email,
          token: generateToken(userInput.id),
        });
      } else {
        res.status(400).json({
          message: "Invalid User Data",
        });
      }
    });
  } else {
    res.status(400).json({
      message: "User validation Failed. Make sure you have filled each fields",
    });
  }
});

// @desc Get user profile
// @route POST /api/users/profile
// @access Private
router.get("/profile", protect, async (req, res) => {
  user.find(req.id, (result) => {
    if (result) {
      res.json({
        id: result.id,
        fname: result.fname,
        lname: result.lname,
        email: result.email,
        isAdmin: result.isAdmin,
      });
    } else {
      res.status(404).json({
        message: "user Not Found",
      });
    }
  });
  // console.log(req.id);
});

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
router.post("/profile", protect, async (req, res) => {
  let userId = req.params.id;

  console.log(req.id);
  let userUpdatedfield = {
    id: userId,
    username: req.body.username,
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
  };

  user.update(userUpdatedfield, (user) => {
    if (user) {
      res.json({
        id: user.id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user.id),
      });
    } else {
      res.status(404).json({
        message: "User Not Found.",
      });
    }
  });
  // console.log(req.id);
});

module.exports = router;
