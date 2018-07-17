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
    data: data
  });

  addPinExtras(data);
  closeDialog(true);
}

$('.pin').click(preventPropagation);

$('.pin').hover(pinHoverLabel);

$('#map').click(function(e) {
  if (openDialog) return closeDialog();
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
}

const closeDialog = (submitted) => {
  openDialog.remove();
  if (!submitted) currentPin.remove();
  openDialog = null;
  currentPin = null;
}