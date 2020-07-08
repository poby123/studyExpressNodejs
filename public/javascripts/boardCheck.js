$('.board-form').submit(function(){
  if(confirm('Do you really want to delete this writing? Once your delete writing, you cannot recover!')){
    return true;
  }else{
    return false;
  }
});
