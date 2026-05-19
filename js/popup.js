document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('casino-modal');
  const closeModal = document.getElementById('close-modal');
  const playNow = document.getElementById('play-now');

  const openModal = () => modal?.classList?.add('visible');
  const closePopup = () => modal?.classList?.remove('visible');

  window.showCasinoPopup = () => openModal();

  closeModal?.addEventListener('click', closePopup);
  playNow?.addEventListener('click', closePopup);
});
