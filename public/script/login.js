$(function(){
    $( ".try-link" ).click(function(event){
      if($("#sign-in-button").length > 0){
      	event.preventDefault();
      	alert('You have to login with facebook to try a habit');
		}
   });

});