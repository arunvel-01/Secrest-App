require("dotenv").config(); 
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

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

const user = new mongoose.model("User", userSchema)


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
  const newUser = new user({
    email: req.body.username,
    password: md5(req.body.password)
  });

  newUser.save()
    .then(function() {
      res.render("secrets");
    })
    .catch(function(err) {
      console.log(err);
    });
});

app.post("/login", async function(req, res){
  const username = req.body.username;
  const password = md5(req.body.password);

  try {
    const foundUser = await user.findOne({ email: username }).exec();
    if (foundUser && foundUser.password === password) {
      res.render("secrets");
    } else {
      res.render("login", { error: "Invalid username or password" });
    }
  } catch (error) {
    console.error(error);
  }
});




app.listen(3000, function () {
  console.log("Server is started on port 3000");
});
