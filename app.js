// Import necessary modules and libraries
require("dotenv").config(); 
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

// Create an instance of the Express app
const app = express();  

// Configure the app
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// Set up session management
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport and set up session management
app.use(passport.initialize());
app.use(passport.session());

// Connect to the MongoDB database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the user schema
const userSchema = new mongoose.Schema ({
  email: String,
  password: String,
  googleId: String,
  secret: String
});

// Plug in necessary Passport and Mongoose plugins
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

// Create the User model
const User = mongoose.model("User", userSchema);

// Set up Passport to use the local strategy
passport.use(User.createStrategy());

// Serialize and deserialize user information for session management
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err);
    });
});

// Set up Google OAuth authentication strategy
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "https://secrets-web-app-evob.onrender.com/auth/google/secrets" ||  "http://localhost:3000/auth/google/secrets",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
function(accessToken, refreshToken, profile, cb) {
  console.log(profile);
  User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));

// Define routes

// Home route
app.get("/", function(req, res){
  res.render("home");
});

// Google OAuth authentication route
app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile"] }));

// Google OAuth callback route
app.get("/auth/google/secrets", 
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    res.redirect("/secrets");
  });

// Login route
app.get("/login", function(req, res){
  res.render("login");
});

// Register route
app.get("/register", function(req, res){
  res.render("register");
});

// Secrets route
app.get("/secrets", async function(req, res){
  try {
    const foundUsers = await User.find({ secret: { $ne: null } }).exec();
    if (foundUsers && foundUsers.length > 0) {
      res.render("secrets", { usersWithSecrets: foundUsers });
    }
  } catch (err) {
    console.error(err);
    // Handle the error appropriately
  }
});

// Submit route
app.get("/submit", function(req, res){
  if(req.isAuthenticated()){
    res.render("submit");
  } else {
    res.redirect("/login");
  }
});

// Process submitted secret
app.post("/submit", async function(req, res){
  const submittedSecret = req.body.secret;
  console.log(req.user.id);

  try {
    const foundUser = await User.findById(req.user.id);
    if (foundUser) {
      foundUser.secret = submittedSecret;
      await foundUser.save();
      res.redirect("/secrets");
    }
  } catch (error) {
    console.log(error);
    // Handle the error appropriately
  }
});

// Logout route
app.get("/logout", function(req, res){
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// Process registration
app.post("/register", function(req, res){
  User.register(
    { username: req.body.username },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/secrets");
        });
      }
    }
  );
});

// Process login
app.post("/login", async function(req, res){
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/secrets");
      });
    }
  });
});

// Start the server
const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`Server is running on port ${port}.`);
});
