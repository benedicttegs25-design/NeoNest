const hamburger = document.getElementById('hamburger')

const navMenu = document.getElementById('nav-menu')

hamburger.addEventListener('click' , () => {
    hamburger.classList.toggle('active')
    navMenu.classList.toggle('active')

});

// Open modal
  document.querySelectorAll('[data-modal-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.getElementById(btn.dataset.modalTarget);
      modal?.classList.remove('hidden');
      document.body.style.overflow = 'hidden'; // lock background scroll
    });
  });
 
  // Close modal via close button
  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.closest('[id^="modal"]')));
  });
 
  // Close modal by clicking the dark backdrop
  document.querySelectorAll('[id^="modal"]').forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal(modal);
    });
  });
 
  // Close modal with Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('[id^="modal"]:not(.hidden)').forEach(closeModal);
    }
  });
 
  function closeModal(modal) {
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
  