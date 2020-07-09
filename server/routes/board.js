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
    let page = req.query.page;
    let category = req.query.category;
    if (bno !== undefined && bno !== '') {
      console.log('in if bno');
      connection.query('SELECT * FROM tblboard where bno=?', [bno], function(err, results) {
        if (err) {
          console.log(err);
          res.redirect('/');
        }
        res.render('board', {
          id: req.session.dbid,
          bno: results[0].bno,
          title: results[0].title,
          content: results[0].content,
          writer: results[0].writer,
          registerDate: results[0].registerDate.toString().substring(0, 15),
          updateDate: results[0].updateDate.toString().substring(0, 15),
          category: results[0].category,
          menuLocation: '/auth/signout',
          menu: 'Sign out',
          menuLocation2: '/auth/mypage',
          menu2: 'My Page',
          nav1Location: '/board?category=qna&page=1',
          nav2Location: '/board?category=designs&page=1',
          nav3Location: '/board?category=request&page=1',
        });
      });
    } else if (category) {
      if (page === undefined || page === '') page = 1;
      connection.query('SELECT * FROM tblboard where category=? ', [category], function(err, results) {
        if (err) {
          console.log(err);
          res.redirect('/');
        }
        let rows = results.reverse();
        if (!rows[page * 20 - 1]) { //rows[page * 20 - 1] is undefined at last page
          res.render('qna', {
            title: category,
            rows: rows.slice((page - 1) * 20, rows.length),
            list: rows.length,
            nowPage: page,
            menuLocation: '/auth/signout',
            menu: 'Sign out',
            menuLocation2: '/auth/mypage',
            menu2: 'My Page',
            nav1Location: '/board?category=qna&page=1',
            nav2Location: '/board?category=designs&page=1',
            nav3Location: '/board?category=request&page=1',
          });
        } else {
          res.render('qna', {
            title: category,
            rows: rows.slice((page - 1) * 20, page * 20),
            list: rows.length,
            nowPage: page,
            menuLocation: '/auth/signout',
            menu: 'Sign out',
            menuLocation2: '/auth/mypage',
            menu2: 'My Page',
            nav1Location: '/board?category=qna&page=1',
            nav2Location: '/board?category=designs&page=1',
            nav3Location: '/board?category=request&page=1',
          });
        }
      }); //query end
    } else { //when there are no category and no boardNumber
      res.redirect('/');
    }
  } else {
    res.redirect('/auth/signin');
  }
});

/*GET writhing*/
router.get('/writing', function(req, res, next) {
  if (req.session.dbid) {
    let category = req.query.category;
    if (category && (category === 'qna' || category === 'designs' || category === 'request')) {
      res.render('writing', {
        category: category,
        title: 'Writing',
        menuLocation: '/auth/signout',
        menu: 'Sign out',
        menuLocation2: '/auth/mypage',
        menu2: 'My Page',
        nav1Location: '/board?category=qna&page=1',
        nav2Location: '/board?category=designs&page=1',
        nav3Location: '/board?category=request&page=1',
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
        VALUES(?,?,?,?,?,?)`, [title, content, writer, now, now, category], function(err, results) {
      if (err) {
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
    if (bno !== undefined && bno !== '') {
      connection.query('SELECT * FROM tblboard where bno=?', [bno], function(err, results) {
        if (err) {
          console.log(err);
          res.redirect('/');
        }
        res.render('edit', {
          title: 'Edit',
          bno: results[0].bno,
          board_title: results[0].title,
          content: results[0].content,

          menuLocation: '/auth/signout',
          menu: 'Sign out',
          menuLocation2: '/auth/mypage',
          menu2: 'My Page',
          nav1Location: '/board?category=qna&page=1',
          nav2Location: '/board?category=designs&page=1',
          nav3Location: '/board?category=request&page=1',
        });
      });
    } else {
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
    if (bno) {
      connection.query('UPDATE tblboard SET title=?, content=?, updateDate=NOW() WHERE bno=?', [title, content, bno],
        function(err, results) {
          if (err) {
            console.log(err);
            res.redirect('/');
          }
          res.redirect('/board?boardNumber=' + bno);
        });
    } else {
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
    console.log('in delete bno : ', bno);
    let category = req.body.category;
    if (bno) {
      connection.query('DELETE FROM tblboard WHERE bno=?', [bno],
        function(err, results) {
          if (err) {
            console.log(err);
            res.redirect('/');
          }
          res.redirect('/board?category=' + category);
        });
    } else {
      res.redirect('/');
    }
  } else {
    res.redirect('/auth/signin');
  }
});

module.exports = router;
