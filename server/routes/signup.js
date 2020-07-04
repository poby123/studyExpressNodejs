var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('signup', { title: 'Sign Up', msg:'' });
});

router.post('/', function(req, res, next) {
  var name = req.body.name;
  var id = req.body.id;
  var pw = req.body.password;
  var email = req.body.email;
  if(name === '' || pw === '' || id === ''){
    res.render('signup', { title: 'Sign Up', msg : 'failed signup due empty input!'});
  }else{
    res.redirect('signin');
  }
  //console.log(req.body.name);
})
module.exports = router;
