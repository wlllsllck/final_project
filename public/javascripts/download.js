// document ready call itself
$(window).on('load', function() {
    $.ajax({
      url: '/download',
      type: 'POST',
      success : function(data){
        //   console.log(data);
        // var d = JSON.parse(data);
        for(var i=0;i<data.length; i++) {
            $('#listfile > tbody:last-child').append('<tr><td> ID </td> <td> UPLOADER </td>' +
                                                     '<td>'+data[i]+'</td>' +                                       
                                                     '<td> TIME </td>' +
                                                     '<td> YEAR </td>' +
                                                     '<td>'+'<a class="custom" href="/' + data[i] +'">'+'LINK'+'</a>'+'</td>' + 
                                                     '</tr>');
        }
      }
    });
});

