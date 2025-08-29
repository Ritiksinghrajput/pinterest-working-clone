var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const passport = require('passport');
const upload = require('./multer');

const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));

router.get("/", function (req, res, next) {
  res.render("index");
});

router.get("/login", function (req, res, next) {
  res.render("login", {error: req.flash('error')});
});

router.get("/feed", function (req, res, next) {
  res.render("feed");
});

router.post("/upload", isLogedIn, upload.single("file"), async function (req, res, next) {
  if(!req.file){
    return res.status(404).send("no files were given");
  }
  const user = await userModel.findOne({username: req.session.passport.user});
  const post = await postModel.create({
    image: req.file.filename,
    imageText: req.body.filecaption,
    user: user._id

  });
  
  user.posts.push(post._id);
  await user.save();
  res.send("Done");
});

router.get("/profile", isLogedIn, async function (req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
    .populate("posts");
  res.render("profile", {user});
});

router.post("/register", function (req, res) {
  const { username, email, fullName, password } = req.body;
  const userData = new userModel({ username, email, fullName });

  userModel.register(userData, req.body.password)
    .then(function () {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile");
      });
    })
    .catch(function (err) {
      console.error("Registration error:", err);
      res.redirect("/login");
    });

router.post("/login", passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true
  }), function(req, res){

})    
});

router.get("/logout", function(req, res){
  req.logout(function(err){
    if(err){ return next(err); }
    res.redirect("/");
  });
})

function isLogedIn(req, res, next){
  if(req.isAuthenticated()) return next();
  res.redirect("/login");
}

module.exports = router;
