const express = require('express');
const session = require('express-session');
const CryptoJS = require("crypto-js");

const sessionAuth = require('../config/session.js');

var router = express.Router();
router.use(session(sessionAuth));

/* GET home page. */
router.get('/', function(req, res, next) {

  if (req.session.dbid) {
    console.log(req.session.dbid);
    res.render('index', {
      menuLocation: '/auth/signout',
      menu: 'Sign out',
      menuLocation2: '/auth/mypage',
      menu2: 'My Page',
      nav1Location: '/board/qna?page=1',
      nav2Location: '/board/designs',
      nav3Location: '/board/request',
    });
  } else {
    res.render('index', {
      menuLocation: '/auth/signin',
      menu: 'Sign in',
      menuLocation2: '/auth/signup',
      menu2: 'Sign up today',
      nav1Location: '/auth/signin',
      nav2Location: '/auth/signin',
      nav3Location: '/auth/signin',
    });
  }
});

module.exports = router;
