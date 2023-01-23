var express = require("express");
const Article = require("../model/Article");
var auth = require("../middlewares/auth");
var router = express.Router();

router.get("/", (req, res, next) => {
  res.redirect("/");
});

// NEW ARTICLE FORM
router.get("/new", auth.isLoggedIn, (req, res, next) => {
  res.render("articles/newArticle");
});

// POST ARTICLE
router.post("/new", auth.isLoggedIn, (req, res, next) => {
  req.body.author = req.user._id;
  Article.create(req.body, (err, article) => {
    console.log(err, article);
  });
});

// VIEW ARTICLE
router.get("/:id", (req, res, next) => {
  var articeId = req.params.id;
  Article.findById(articeId)
    .populate("author")
    .exec((err, article) => {
      if (err) return next(err);
      res.render("articles/article.ejs", { article });
    });
});

module.exports = router;
