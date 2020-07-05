$('#signinSubmit').on('click',function(){
  var text = $('#password').val();
  var target = $('#submitPassword');
  encrypting(text, target);
});
