const btnContact = document.querySelector('.btn-contact');
const modalContainer = document.querySelector('.modal-container');
const closeBtn = document.querySelector('.close-modal');
const fadeElems = document.querySelectorAll('.has-animation');

btnContact.addEventListener('click', function () {
  // Open Modal
  modalContainer.classList.remove('hidden');
  // Prevent Overflow
  document.querySelector('body').style.overflow = 'hidden';

  fadeElems.forEach(function (element) {
    element.classList.add('smooth-visible');
  });
});

closeBtn.addEventListener('click', function (e) {
  // Close Model
  modalContainer.classList.add('hidden');
  document.querySelector('body').style.overflow = 'scroll';
  fadeElems.forEach(function (element) {
    element.classList.remove('smooth-visible');
  });
});
