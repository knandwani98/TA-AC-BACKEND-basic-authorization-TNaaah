var express = require("express");
var router = express.Router();
var User = require("../model/User");

// SIGNUP PAGE
router.get("/new", function (req, res, next) {
  if (req.session && req.session.userId) {
    return res.redirect("/");
  }
  res.render("users/signup");
});

// CREATING A USER
router.post("/new", function (req, res, next) {
  var data = req.body;
  User.create(data, (err, user) => {
    if (err) return next(err);
    req.flash("success", "User created successfully ");
    res.redirect("/users/login");
  });
});

// LOGIN PAGE
router.get("/login", function (req, res, next) {
  if (req.session && req.session.userId) {
    return res.redirect("/");
  }

  var flash = {
    success: req.flash("success")[0],
    error: req.flash("error")[0],
  };
  res.render("users/login", { flash });
});

// LOGINING IN USER
router.post("/login", function (req, res, next) {
  var { email, password } = req.body;

  // if input is empty
  if (!email || !password) {
    req.flash("error", "Please enter both email and password fields");
    return res.redirect("/users/login");
  }

  // FINDING USER
  User.findOne({ email }, (err, user) => {
    if (err) next(err);

    // USER DOESNT EXIST
    if (!user) {
      req.flash("error", "This is not registered. Please register");
      return res.redirect("/users/login");
    }

    // CONFIRM PASSWORD
    user.compare(password, (err, result) => {
      if (err) return next(err);

      if (!result) {
        req.flash("error", "Please enter valid password");
        return res.redirect("/users/login");
      }

      req.session.userId = user.id;
      req.flash("success", "Welcome " + user.name);
      return res.redirect("/");
    });
  });
});

//LOGOUT PAGE
router.get("/logout", function (req, res, next) {
  req.flash("success", "user logout successfully");
  res.clearCookie("connect.sid");
  req.session.destroy();
  res.redirect("/users/login");
});

module.exports = router;
