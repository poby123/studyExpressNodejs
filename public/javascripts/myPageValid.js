$('.mypage-validation').submit(function(){
  if($('#name').val() === '' || $('#confirmPassword').val() === ''){
      alert('name or confirm password is empty!');
      return false;
  }
  if($('#newPassword').val() !== ''){
    if($('#newPassword').val() === $('#checkNewPassword').val()){
      encrypting($('#newPassword').val(), $('#newPasswordForSubmit'));
      encrypting($('#confirmPassword').val(), $('#confirmPasswordForSubmit'));
      return true;
    }
    else{
      alert('new password and check password is different');
      $('#newPassword').val('');
      $('#checkNewPassword').val('');
      return false;
    }
  }
  else{
    encrypting($('#confirmPassword').val(), $('#confirmPasswordForSubmit'));
    return true;
  }
});
