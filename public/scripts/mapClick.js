const pinDialogClickHandler = e => e.stopPropagation();
let openDialog = null;
let currentPin = null;

$('#map').click(function(e) {
  if (openDialog) return closeDialog(openDialog, currentPin);
  const x = e.pageX - $(this).offset().left - 5;
  const y = e.pageY - $(this).offset().top - 5;

  const newPin = $("<div>", {"class": "pin"});
  const newDialog = newPinDialog();

  newPin.offset({ top: y, left: x });
  newPin.append(newDialog);
  $(this).append(newPin);

  openDialog = newDialog;
  currentPin = newPin;
});

const newPinDialog = () => {
  const pinDialog = $("<div>", {"class": "pin-dialog"});
  const form = $("<form action='/new_pin' method='post'></form>");

  form.append('<input type="text" placeholder="description" name="text"/>');
  form.append("<input type='text' placeholder='location' name='location'/>");
  form.append("<input type='submit'/>")

  pinDialog.append(form);
  pinDialog.on('click', pinDialogClickHandler);

  return pinDialog;
}

const closeDialog = (dialog, pin) => {
  dialog.remove();
  pin.remove();
  openDialog = null;
  currentPin = null;
}