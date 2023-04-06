const express = require("express");
const { UserModel } = require("../model/User.model");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

userRouter.get("/", async (req, res) => {
  try {
    let users = await UserModel.find();

    res.send(users);
  } catch (err) {
    console.log(err);
    res.send({ msg: "Something went wrong" });
  }
});

userRouter.post("/signup", async (req, res) => {
  try {
    const { email, password, confirmpassword } = req.body;

    let userExist = await UserModel.findOne({ email });

    if (userExist) {
      res.send({ msg: "User already Registered" });
    } else {
      bcrypt.hash(password, 5, async function (err, secure_password) {
        let newUser = new UserModel({
          email,
          password: secure_password,
          confirmpassword: secure_password
        });
        await newUser.save();

        res.send({ msg: "User Registered Successfully", newUser });
      });
    }
  } catch (err) {
    console.log(err);
    res.send({ msg: "Error in Registration" });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.find({ email });
    if(!user){
        res.send({msg:"User not found"})
    }
    if (user.length > 0) {
      bcrypt.compare(password, user[0].password, async (err, result) => {
        if (result) {
          let token = jwt.sign({ userID: user[0]._id }, "masai");
          res.send({ msg: "Login Successful", token: token });
        }
      });
    } else {
      res.send({ msg: "Invalid Credentials" });
    }
  } catch (err) {
    res.send({ msg: "Can't login" });
    console.log(err);
  }
});

module.exports = {
  userRouter,
};
