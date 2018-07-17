const displayLabel = () => {
  console.log($(this).children('.pin-hover-label'));
}
const hideLabel = () => $(this).children('.pin-hover-label');

$('.pin').hover(function() {
  $(this).children('.pin-hover-label').toggle();
});