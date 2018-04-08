$(window).on('load', function() {
  $('.progress-bar').text('0%');
  $('.progress-bar').width('0%');

});  

function post (path, data) {
  return window.fetch(path, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

$('.upload-input').on('click', function() {
  
  // console.log("click");
  // $('.progress-bar').text('0%');
  // $('.progress-bar').width('0%');
  // var files = $(this).get(0).files;
  // $('#myform')[0].reset();
  
  var UploadFile = document.querySelector('.UploadFile')
  var uploader = UploadFile.querySelector('.uploader').value
  var uploader_email = UploadFile.querySelector('.uploader-email').value
  var year = UploadFile.querySelector('.year').value
  var files = UploadFile.querySelector('.files').value
  if(!uploader || !uploader_email || !year || !files){
    alert("Please fill in all informations")
  }
  else {
    // alert("POST")
    // action = "true"
    // $('.upload-btn').click();
    post('/UploadFile', { uploader, uploader_email, year, files})
  }
  
  var files_input = document.getElementById("files");
  
  if (!files_input) {
    alert("Um, couldn't find the fileinput element.");
  }
  else if (!files_input.files) {
    alert("This browser doesn't seem to support the `files` property of file inputs.");
  }
  else if (!files_input.files[0]) {
    alert("Please select a file before clicking 'Load'");               
  }
  else {
    // var files = files_input.files[0];
    var files = files_input.files;
    if (files.length > 0) {
      // alert("hello");
      // create a FormData object which will be sent as the data payload in the
      // AJAX request
      var formData = new FormData();
      
      // loop through all the selected files and add them to the formData object
      for (var i = 0; i < files.length; i++) {
        let file = files[i];
        
        // add the files to formData object for the data payload
        formData.append('uploads[]', file, file.name);
      }
      
      $.ajax({
        url: '/upload',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data){
          console.log(data);
        },
        xhr: function() {
          // create an XMLHttpRequest
          var xhr = new XMLHttpRequest();
          
          // listen to the 'progress' event
          xhr.upload.addEventListener('progress', function(evt) {
            
            if (evt.lengthComputable) {
              // calculate the percentage of upload completed
              var percentComplete = evt.loaded / evt.total;
              percentComplete = parseInt(percentComplete * 100);
              
              // update the Bootstrap progress bar with the new percentage
              $('.progress-bar').text(percentComplete + '%');
              $('.progress-bar').width(percentComplete + '%');
              
              // once the upload reaches 100%, set the progress bar text to done
              if (percentComplete === 100) {
                $('.progress-bar').html('Done');
              }
              
            }
            
          }, false);
          
          return xhr;
        }
      });
      
    }
    else {
      alert("files.length <=0");
    }
    
  }
  
});

// var UploadFile = document.querySelector('.UploadFile')
// UploadFile.addEventListener('submit', (e) => {
//   e.preventDefault()
//   var uploader = UploadFile.querySelector('.uploader').value
//   var uploader_email = UploadFile.querySelector('.uploader-email').value
//   var year = UploadFile.querySelector('.year').value
//   var files = UploadFile.querySelector('.files').value
//   if(!uploader || !uploader_email || !year || !files){
//     alert("Please fill in all informations")
//   }
//   else {
//     // alert("POST")
//     // action = "true"
//     // $('.upload-btn').click();
//     post('/UploadFile', { uploader, uploader_email, year, files})
//   }
  
// })