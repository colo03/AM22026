document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('casino-modal');
  const closeModal = document.getElementById('close-modal');
  const playNow = document.getElementById('play-now');

  const casinoMessages = [
    {
      title: "¿Querés ganar MÁS? 💰",
      text: "Tienes 3 giros gratis. Los otros jugadores ganan todo el tiempo."
    },
    {
      title: "NO TE VAYAS 🔥",
      text: "Bonificación 100% extra. Solo jugadores que se retiran ahora."
    },
    {
      title: "¡ÚLTIMA OPORTUNIDAD! ⏰",
      text: "Triplicarás tu dinero con nuestro Mega Jackpot. Expira en 2 minutos."
    },
    {
      title: "TU AMIGO GANÓ 💸",
      text: "Carlos acaba de ganar $200. Juega ahora y vos también podes."
    },
    {
      title: "DINERO FÁCIL 🎰",
      text: "Jugadores como vos ganan en promedio $500/día. ¿Por qué no vos?"
    },
    {
      title: "¡NUEVO JUEGO DESBLOQUEADO! 🔓",
      text: "Descubrimos un juego secreto con pagos gigantes. ¡Pruébalo!"
    },
    {
      title: "OFERTA EXCLUSIVA VIP 💎",
      text: "Fuiste seleccionado. Deposita $10 y juega con $100."
    },
    {
      title: "¡ALGUIEN GANÓ EL JACKPOT! 🏆",
      text: "María de Buenos Aires acaba de ganar $10,000. El próximo puedes ser vos."
    },
    {
      title: "TIEMPO LÍMITE ⌛",
      text: "Tus giros gratis expiran en 60 segundos. ¡Úsalos ya!"
    },
    {
      title: "¡NO TE LO PIERDAS! 🚀",
      text: "Es tu día de suerte. Las estadísticas muestran que estás a punto de ganar."
    }
  ];

  const openModal = () => modal?.classList?.add('visible');
  const closePopup = () => modal?.classList?.remove('visible');

  // Show popup with random chance (50% by default)
  window.showCasinoPopupRandom = (chance = 0.5) => {
    if (Math.random() < chance) {
      const randomMsg = casinoMessages[Math.floor(Math.random() * casinoMessages.length)];
      
      // Update for prize page
      const titleElement = document.getElementById('popupTitle') || document.querySelector('.modal-content h2');
      const msgElement = document.getElementById('popupMessage') || document.querySelector('.modal-content p');
      
      if (titleElement) titleElement.textContent = randomMsg.title;
      if (msgElement) msgElement.textContent = randomMsg.text;
      
      openModal();
    }
  };

  // Always show popup
  window.showCasinoPopup = () => openModal();

  closeModal?.addEventListener('click', closePopup);
  playNow?.addEventListener('click', closePopup);
});
