// document ready call itself
$(window).on('load', function() {
    $.ajax({
      url: '/download',
      type: 'POST',
      success : function(data){
        //   console.log(data);
        // var d = JSON.parse(data);
        for(var i=0;i<data.length; i++) {
            $('#listfile > tbody:last-child').append('<tr><td>'+data[i]+'</td>' + 
                                                     '<td>'+'<a href="/' + data[i] +'">'+'Link'+'</a>'+'</td>' + 
                                                     '</tr>');
        }
      }
    });
});