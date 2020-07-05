const express = require('express');
const session = require('express-session');
const CryptoJS = require("crypto-js");

const sessionAuth = require('../config/session.js');

var router = express.Router();
router.use(session(sessionAuth));

/* GET home page. */
router.get('/', function(req, res, next) {

  if(req.session.dbid){
      console.log(req.session.dbid);
      res.render('index', {title:'Home',
      menuLocation : 'signout', menu : 'Sign out', menuLocation2 : 'myPage', menu2:'My Page',
    });
  }
  else{
    res.render('index', {title:'Home',
    menuLocation : 'signin', menu : 'Sign in', menuLocation2 : 'signup', menu2:'Sign Up'});
  }
});

module.exports = router;
