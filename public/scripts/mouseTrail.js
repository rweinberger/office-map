$('#map').on('mousemove', function(e){
  $('#mouse-trail').css({
    left:  e.pageX - 5,
    top:   e.pageY - 5
  });
});

$('#map').on('mouseenter mouseleave', function(e){
  $('#mouse-trail').toggle()
});