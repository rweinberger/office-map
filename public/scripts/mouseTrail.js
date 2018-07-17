$('#map').on('mousemove', function(e){
  $('#mouse-trail').css({
    left:  e.pageX - 5,
    top:   e.pageY - 5
  });
});

$('#map').on('mouseenter', function(e){
  $('#mouse-trail').show()
});

$('#map').on('mouseleave', function(e){
  $('#mouse-trail').hide()
});