require('dotenv').config(); // it should be put first line.
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// let see inside .env: secret file
//console.log(process.env.API_KEY);

// db
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

// this object/schema is stored in mongoose schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// Secret String Instead of Two Keys
// For convenience, you can also pass in a single secret string instead of two keys.
const encryptionOptions = {
  secret: process.env.SECRET, //get from .env (secret file)
  encryptedFields: ["password"],
  //additionalAuthenticatedFields: ["email"] // Add the field(s) you want to be authenticated
};
userSchema.plugin(encrypt, encryptionOptions);

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save()
    .then(function () {
      res.render("secrets"); //when only user login or signUp, rend user to secret page
    })
    .catch(function (err) {
      console.log("something wrong!")
      console.log(err);
    });
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({
    email: username
  })
    .then(function (foundUser) {
      if (foundUser.password === password) {
        res.render("secrets");
      }
    })
    .catch(function (err) {
      console.log("something wrong!");
      console.log(err);
    });
});

app.listen(3000, function () {
  console.log("Server started on port 3000.");
});
