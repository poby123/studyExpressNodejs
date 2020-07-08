// Example starter JavaScript for disabling form submissions if there are invalid fields
function validPassword(password, checkPassword){
  if(password != checkPassword) return false;
}

(function () {
  'use strict'

  window.addEventListener('load', function () {
    var signupForms = document.getElementsByClassName('signup-validation');

    Array.prototype.filter.call(signupForms, function (form) {
      form.addEventListener('submit', function (event) {

        var password = $('#password').val();
        var checkPassword = $('#checkPassword').val();
        var target = $('#submitPassword');

        if(validPassword(password, checkPassword) === false){
          alert('password is not match');
          event.preventDefault()
          event.stopPropagation()
        }
        else if (form.checkValidity() === false) {
          alert('Please Write required information!');
          event.preventDefault()
          event.stopPropagation()
        }
        encrypting(password, target);
      }, false)
    })
  }, false)
}())
