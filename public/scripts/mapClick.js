let openDialog = null;
let currentPin = null;
const preventPropagation = e => e.stopPropagation();

$('.pin').click(preventPropagation);

$('#map').click(function(e) {
  if (openDialog) return closeDialog(openDialog, currentPin);
  const x = e.pageX - $(this).offset().left - 5;
  const y = e.pageY - $(this).offset().top - 5;

  const pin = $("<div>", {"class": "pin"});
  const newDialog = newPinDialog();

  pin.offset({ top: y, left: x });
  pin.append(newDialog);
  pin.on('click', preventPropagation)
  $(this).append(pin);

  openDialog = newDialog;
  currentPin = pin;
});

const newPinDialog = () => {
  const pinDialog = $("<div>", {"class": "pin-dialog"});
  pinDialog.append('<b>add pin</b><br><br>');
  const form = $("<form action='/new_pin' method='post'></form>");

  form.append('<input type="text" placeholder="description" name="text"/>');
  form.append("<input type='text' placeholder='location' name='location'/><br>");
  form.append("<input type='submit'/>")

  pinDialog.append(form);
  pinDialog.on('click', preventPropagation);

  return pinDialog;
}

const closeDialog = (dialog, pin) => {
  dialog.remove();
  pin.remove();
  openDialog = null;
  currentPin = null;
}