let openDialog, currentPin, pinX, pinY;
const preventPropagation = e => e.stopPropagation();
const pinHoverLabel = function() {$(this).children('.pin-hover-label').toggle()};
const formSubmitHandler = e => {
  e.preventDefault();
  const form = e.target;
  const data = {
    userId: 1,
    left: pinX,
    top: pinY,
    text: form.children[0].value,
    location: form.children[1].value
  };

  $.ajax({
    type: "POST",
    url: '/new_pin',
    data: data,
    success: data => {
      addPinExtras(data);
      closeDialog(true);
    }
  });
}

$('.pin').hover(pinHoverLabel);

$('.modal').click(preventPropagation);

$('#map').click(function(e) {
  if (openDialog) return closeDialog();
  if (e.target.className === 'pin') return;

  pinX = e.pageX - $(this).offset().left - 5;
  pinY = e.pageY - $(this).offset().top - 5;


  const pin = $("<div>", {"class": "pin"});
  const newDialog = newPinDialog();

  pin.offset({ top: pinY, left: pinX });
  pin.append(newDialog);
  pin.click(preventPropagation);
  $(this).append(pin);

  openDialog = newDialog;
  currentPin = pin;
});

const newPinDialog = () => {
  const pinDialog = $("<div>", {"class": "pin-dialog"});
  pinDialog.append('<b>add pin</b><br><br>');
  const form = $("<form class='pin-form'></form>");

  form.append('<input type="text" placeholder="description" name="text"/>');
  form.append("<input type='text' placeholder='location' name='location'/><br>");
  form.append("<input type='submit'/>");
  form.submit(formSubmitHandler);

  pinDialog.append(form);
  pinDialog.on('click', preventPropagation);

  return pinDialog;
}

const addPinExtras = (data) => {
  const hoverLabel = $("<div class='pin-hover-label'>"+data.text+"</div>");
  currentPin.append(hoverLabel);
  currentPin.hover(pinHoverLabel);

  // const modal = $('<div class="modal fade" id="modal-' + data._id + '" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"><div class="modal-dialog" role="document"><div class="modal-content"><h3>' + data.text + '</h3>located at ' + data.location + ', posted by user ' + data.userId + '<br><button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button></div></div></div>')
  // currentPin.append(modal);
  // currentPin.attr('data-toggle', 'modal');
  // currentPin.attr('data-target', '#modal-' + data._id);
}

const closeDialog = (submitted) => {
  openDialog.remove();
  if (!submitted) currentPin.remove();
  openDialog = null;
  currentPin = null;
}