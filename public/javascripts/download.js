// document ready call itself
// $(window).on('load', function() {
$(document).ready(function() {  
  $.ajax({
    url: '/download',
    type: 'POST',
    success : function(data){
      //   console.log(data);
      // var d = JSON.parse(data);
      for(var i=0;i<data.length; i++) {
          $('#listfile > tbody:last-child').append('<tr><td>' +data[i].id+ '</td> <td> ' +data[i].uploader+' </td>' +
                                                    '<td>'+data[i].email+'</td>' +                                       
                                                    '<td>'+data[i].file_name+'</td>' +                                       
                                                    '<td>'+data[i].created_at+'</td>' +
                                                    '<td>'+data[i].year+'</td>' +
                                                    '<td>'+'<a class="custom" href="/' + data[i].file_name +'">'+'LINK'+'</a>'+'</td>' + 
                                                    '</tr>');
      }
    }
  });
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

$('.search-input').on('click', function() {
  var filterSearch = document.querySelector('.filterSearch')
  var uploader = filterSearch.querySelector('.uploader').value
  var uploader_email = filterSearch.querySelector('.uploader-email').value
  var year = filterSearch.querySelector('.year').value
  
  post('/filterSearch', { uploader, uploader_email, year})

});