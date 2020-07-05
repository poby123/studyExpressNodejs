const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const CryptoJS = require("crypto-js");

const dbConfig = require('../config/database.js');
const sessionAuth = require('../config/session.js');

const router = express.Router();
const connection = mysql.createPool(dbConfig);

const KEY = 'CIPHERKEY';

router.use(session(sessionAuth));

//router signup get
router.get('/signup', function(req, res, next) {
  res.render('signup', {
    title: 'Sign Up',
    msg: ''
  });
});

//router signup post
router.post('/signup', function(req, res, next) {
  let signup = {
    id: req.body.id,
    name: req.body.name,
    pw: req.body.submitPassword,
    email: req.body.email
  };
  if (signup.id === '' || signup.pw === '' || signup.name === '') {
    res.render('signup', {
      title: 'Sign Up',
      msg: 'failed signup due empty input!'
    });
  } else {
    connection.query('INSERT INTO tbluser VALUES (?,?,?,?)', [signup.id, signup.name, signup.pw, signup.email],
      function(err, results) {
        if (err) {
          console.log('error occurred', err);
          res.render('signup', {
            title: 'Sign Up',
            msg: 'The ID is already used! please write different ID!'
          });
        } else {
          console.log('signup success : ', signup, results);
          res.render('signin', {
            title: 'Sign in',
            msg: 'Welcome! Success Sign Up!'
          });
        }
      });
  }
})

//router signin get
router.get('/signin', function(req, res, next) {
  res.render('signin', {
    title: 'Sign In',
    msg: ''
  });
});

//router signin post
router.post('/signin', function(req, res) {
  let signin = {
    userid: req.body.id,
    password: req.body.submitPassword
  };

  let inputBytes = CryptoJS.AES.decrypt(signin.password, KEY);
  signin.password = inputBytes.toString(CryptoJS.enc.Utf8);

  connection.query('SELECT * FROM tbluser WHERE dbid = ?', [signin.userid], function(err, results) {
    if (err) {
      res.render('signin', {
        title: 'Sign in',
        msg: 'Error is Occurred!'
      });
    } else if (results.length > 0 && signin.userid === results[0].dbid) {
      let dbBytes = CryptoJS.AES.decrypt(results[0].dbpw, 'CIPHERKEY');
      results[0].dbpw = dbBytes.toString(CryptoJS.enc.Utf8);

      if (signin.password === results[0].dbpw) {
        req.session.dbid = results[0].dbid;
        req.session.save(function() {
          console.log('login Success!, id: ', results[0].dbid);
          res.redirect('/');
        });
      }
    } else {
      res.render('signin', {
        title: 'Sign In',
        msg: 'ID or PASSWORD is Wrong!'
      });
    }
  });
});

//router signout get
router.get('/signout', function(req, res, next) {
  console.log('in signout router');
  if (req.session.dbid) {
    req.session.destroy(function(err) {
      var msg = '';
      if (err) {
        console.log('error is ouccured in signout ', err);
        msg = 'error is ouccured in signout';
      } else {
        req.session;
        msg = 'Good Bye!';
      }
      res.render('signout', {
        title: 'Sign Out',
        msg: msg
      });
    });
  } else {
    console.log('There is no session id but user attempt signout!');
    res.redirect('/');
  }
});

module.exports = router;
