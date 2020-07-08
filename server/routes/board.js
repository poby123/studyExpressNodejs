const express = require('express');
const mysql = require('mysql');
const session = require('express-session');

const dbConfig = require('../config/database.js');
const sessionAuth = require('../config/session.js');

const router = express.Router();
const connection = mysql.createPool(dbConfig);

router.use(session(sessionAuth));

/* GET board page. */
router.get('/', function(req, res, next) {
  if (req.session.dbid) {
    let bno = req.query.boardNumber;
    console.log(bno);
    if(bno){
      console.log('in if bno');
      connection.query('SELECT * FROM tblboard where bno=?', [bno], function(err, results){
        if(err){
          console.log(err);
          res.redirect('/');
        }
        res.render('board', {
          id : req.session.dbid,
          bno : results[0].bno,
          title : results[0].title,
          content : results[0].content,
          writer : results[0].writer,
          registerDate : results[0].registerDate.toString().substring(0,15),
          updateDate :results[0].updateDate.toString().substring(0,15),
          category : results[0].category,
          menuLocation: '/auth/signout',
          menu: 'Sign out',
          menuLocation2: '/auth/mypage',
          menu2: 'My Page',
          nav1Location: '/board/qna?page=1',
          nav2Location: '/board/designs',
          nav3Location: '/board/request',
        });
      });
    }else{
      console.log('in else bno');
      res.redirect('/');
    }
  } else {
    res.redirect('/auth/signin');
  }
});

/*GET Q&A board page*/
router.get('/qna', function(req, res, next) {
  if (req.session.dbid) {
    let page = req.query.page;
    if(page === undefined) page = 1;
    connection.query('SELECT * FROM tblboard where category="qna" ', function(err, results) {
      if (err) {
        console.log(err);
        res.redirect('/');
      }
      let rows = results.reverse();
      if (!rows[page * 20 - 1]) { //rows[page * 20 - 1] is undefined at last page
        res.render('qna', {
          title: 'Q&A',
          rows: rows.slice((page - 1) * 20, rows.length),
          list: rows.length,
          nowPage: page,
          menuLocation: '/auth/signout',
          menu: 'Sign out',
          menuLocation2: '/auth/mypage',
          menu2: 'My Page',
          nav1Location: '/board/qna?page=1',
          nav2Location: '/board/designs',
          nav3Location: '/board/request',
        });
      } else {
        res.render('qna', {
          title: 'Q&A', //this is not displayed yet.
          rows: rows.slice((page - 1) * 20, page * 20),
          list: rows.length,
          nowPage: page,
          menuLocation: '/auth/signout',
          menu: 'Sign out',
          menuLocation2: '/auth/mypage',
          menu2: 'My Page',
          nav1Location: '/board/qna?page=1',
          nav2Location: '/board/designs',
          nav3Location: '/board/request',
        });
      }
    });
  } else {
    res.redirect('/auth/signin');
  }
});

/*GET designs page*/
router.get('/designs', function(req, res, next) {

  if (req.session.dbid) {

  } else {
    res.redirect('/auth/signin');
  }
});

/*GET request page*/
router.get('/request', function(req, res, next) {

  if (req.session.dbid) {

  } else {
    res.redirect('/auth/signin');
  }
});

/*GET writhing*/
router.get('/writing', function(req, res, next) {
  if (req.session.dbid) {
    if (req.query.category) {
      console.log(req.query.category);
      res.render('writing', {
        category: req.query.category,
        title : 'Writing',
        menuLocation: '/auth/signout',
        menu: 'Sign out',
        menuLocation2: '/auth/mypage',
        menu2: 'My Page',
        nav1Location: '/board/qna?page=1',
        nav2Location: '/board/designs',
        nav3Location: '/board/request',
      });
    } else {
      res.redirect('/');
    }
  } else {
    res.redirect('/auth/signin');
  }
});
/*Post writing*/
router.post('/writing', function(req, res, next) {
  if (req.session.dbid) {
    let title = req.body.title;
    let content = req.body.content;
    let writer = req.session.dbid;
    let category = req.body.category;
    let now = new Date();

    connection.query(`INSERT INTO tblboard (title,content,writer,registerDate,updateDate,category)
        VALUES(?,?,?,?,?,?)`,[title, content, writer, now, now, category], function(err, results) {
          if(err){
            console.log(err);
            res.redirect('/board/writing');
          }
          //console.log(results.insertId);
          res.redirect('/board?boardNumber=' + results.insertId);
    });
  } else {
    res.redirect('/auth/signin');
  }
});

/*update*/
router.get('/update', function(req, res, next) {
  if (req.session.dbid) {
    let bno = req.query.boardNumber;
    if(bno){
      connection.query('SELECT * FROM tblboard where bno=?', [bno], function(err, results){
        if(err){
          console.log(err);
          res.redirect('/');
        }
        res.render('edit', {
          title : 'Edit',
          bno : results[0].bno,
          board_title : results[0].title,
          content : results[0].content,

          menuLocation: '/auth/signout',
          menu: 'Sign out',
          menuLocation2: '/auth/mypage',
          menu2: 'My Page',
          nav1Location: '/board/qna?page=1',
          nav2Location: '/board/designs',
          nav3Location: '/board/request',
        });
      });
    }else{
      console.log('in else bno');
      res.redirect('/');
    }
  } else {
    res.redirect('/auth/signin');
  }
});
/*update post*/
router.post('/update', function(req, res, next) {
  if (req.session.dbid) {
    let bno = req.body.boardNumber;
    let title = req.body.title;
    let content = req.body.content;
    if(bno){
      connection.query('UPDATE tblboard SET title=?, content=?, updateDate=NOW() WHERE bno=?', [title,content,bno],
      function(err, results){
        if(err){
          console.log(err);
          res.redirect('/');
        }
        res.redirect('/board?boardNumber=' + bno);
      });
    }else{
      res.redirect('/');
    }
  } else {
    res.redirect('/auth/signin');
  }
});

/*delete*/
router.post('/delete', function(req, res, next) {
  if (req.session.dbid) {
    let bno = req.body.boardNumber;
    console.log('in delete bno : ' , bno);
    let category = req.body.category;
    if(bno){
      connection.query('DELETE FROM tblboard WHERE bno=?', [bno],
      function(err, results){
        if(err){
          console.log(err);
          res.redirect('/');
        }
        res.redirect('/board/'+category);
      });
    } else {
      res.redirect('/');
    }
  } else {
    res.redirect('/auth/signin');
  }
});

module.exports = router;
