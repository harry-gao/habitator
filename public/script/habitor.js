
window.fbAsyncInit = function() {
    // init the FB JS SDK
    FB.init({
      appId      : '144772812392904',                        // App ID from the app dashboard
      channelUrl : '//localhost:3000/channel.html', // Channel file for x-domain comms
      status     : true,                                 // Check Facebook Login status
      xfbml      : true                                  // Look for social plugins on the page
    });

    // Additional initialization code such as adding Event Listeners goes here
   };

  // Load the SDK asynchronously
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/all.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));


$(function(){

   var postToFB = function(callback){
      FB.ui({
             method: 'feed',
             name: 'Habitor announcement',
             link: 'http://www.habitor.com',
             picture: 'http://fbrell.com/f8.jpg',
             caption: 'I am announcing',
             description: 'to be fit, i will run 3 kms every day for 21 days'
            },
            function(response) {
               if (response && response.post_id) {
                  callback();
               } else {
                  alert('Sorry, you have to make your habit public visible');
               }
            });
     };

   var createHabit = function(){
      url = '/habit/create';

      var posting = $.post(url, { 
                                  trigger: $('#trigger').val(), 
                                  goal: $('#goal').val(), 
                                  action: $('#action').val(),
                                  startDate: $('#startDate').val() } );

      posting.done(function( data ) {
        location.reload();
      });
   };

   var progressHabit = function() {
     url = '/habit/update';

     var posting = $.post(url, {lastUpdateDate: new Date().toUTCString()});

     posting.done(function( data ) {
        location.reload();
      });

     posting.fail(function(xhr){
      alert(xhr.responseText);
     })
   };

   //create habit form behavior
   $("#submitButton").click(function(event){
      event.preventDefault();
      if(!validateHabitData()) return;
      postToFB(createHabit);
   });

   //today done button clicked
   $("#today_done").click(function(event){
      event.preventDefault();
      //alert('start');
      postToFB(progressHabit);
   });

   validateHabitData = function(){
      var passed = true;
      $('.error').empty();
      if(isBlank($('#trigger').val())){
          $('#trigger').after('<p class="error">* trigger is required</p>');
          passed = false;
      }
      if(isBlank($('#action').val())){
          $('#action').after('<p class="error">* action is required</p>');
          passed = false;
      }
      if(isBlank($('#goal').val())){
          $('#goal').after('<p class="error">* goal is required</p>');
          passed = false;
      }
      if(!isAfterToday($('#startDate').val())){
          $('#startDate').after('<p class="error">* a date after or equal to today\'s date is expected</p>');
          passed = false;
      }

      return passed;
   }

   function isAfterToday(str){
      var value = Date.parse(str);
      if(isNaN(value)) return false;

      var now = new Date();
      var today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).valueOf();
      return value >= today;
   }

   function isBlank(str) {
    return (!str || /^\s*$/.test(str));}
});