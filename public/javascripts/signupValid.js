// Example starter JavaScript for disabling form submissions if there are invalid fields
function validPassword(password, checkPassword){
  if(password != checkPassword) return false;
}

(function () {
  'use strict'

  window.addEventListener('load', function () {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');

    // Loop over them and prevent submission
    Array.prototype.filter.call(forms, function (form) {
      form.addEventListener('submit', function (event) {

        var password = $('#password').val();
        var checkPassword = $('#checkPassword').val();

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
        //form.classList.add('was-validated')
      }, false)
    })
  }, false)
}())
