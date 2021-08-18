var express = require('express');
var router = module.exports = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {user: req.session.user});
});
