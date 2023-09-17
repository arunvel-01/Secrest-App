require("dotenv").config(); 
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10; 

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true, 
  })
);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
  bcrypt.hash(req.body.password, saltRounds, function(err, hash){
    if(err) {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }

    const newUser = new User({
      email: req.body.username,
      password: hash
    });

    newUser.save()
      .then(function() {
        res.render("secrets");
      })
      .catch(function(err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      });
  });
});

app.post("/login", async function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  try {
    const foundUser = await User.findOne({ email: username }).exec();
    if (foundUser) {
      bcrypt.compare(password, foundUser.password, function(err, result) {
        if(err) {
          console.log(err);
          return res.status(500).send("Internal Server Error");
        }
        if (result === true) {
          res.render("secrets");
        } else {
          res.render("login", { error: "Invalid username or password" });
        }
      });
    } else {
      res.render("login", { error: "Invalid username or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, function () {
  console.log("Server is started on port 3000");
});
