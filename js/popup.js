// Array centralizado que contiene todos los mensajes molestos y manipuladores
const casinoMessages = [
  { title: "¿Querés ganar MÁS? 💰", text: "Tienes 3 giros gratis. Los otros jugadores ganan todo el tiempo." },
  { title: "NO TE VAYAS 🔥", text: "Bonificación 100% extra. Solo jugadores que se retiran ahora." },
  { title: "¡ÚLTIMA OPORTUNIDAD! ⏰", text: "Triplicarás tu dinero con nuestro Mega Jackpot. Expira en 2 minutos." },
  { title: "TU AMIGO GANÓ 💸", text: "Carlos acaba de ganar $200. Juega ahora y vos también podes." },
  { title: "DINERO FÁCIL 🎰", text: "Jugadores como vos ganan en promedio $500/día. ¿Por qué no vos?" },
  { title: "¡NUEVO JUEGO DESBLOQUEADO! 🔓", text: "Descubrimos un juego secreto con pagos gigantes. ¡Pruébalo!" },
  { title: "OFERTA EXCLUSIVA VIP 💎", text: "Fuiste seleccionado. Deposita $10 y juega con $100." },
  { title: "¡ALGUIEN GANÓ EL JACKPOT! 🏆", text: "María de Buenos Aires acaba de ganar $10,000. El próximo puedes ser vos." },
  { title: "TIEMPO LÍMITE ⌛", text: "Tus giros gratis expiran en 60 segundos. ¡Úsalos ya!" },
  { title: "¡NO TE LO PIERDAS! 🚀", text: "Es tu día de suerte. Las estadísticas muestran que estás a punto de ganar." },
  // Mensajes de prize.html
  { title: "¡ESPERA! 💰", text: "Tienes 3 giros gratis. ¡Podrías duplicar tu premio!" },
  { title: "No te vayas 🎰", text: "Otros jugadores ganaron MÁS jugando. ¡Vos también podes!" },
  { title: "¡ÚLTIMA OPORTUNIDAD! 🔥", text: "Bonificación especial: 100% extra en tu próximo juego. Solo para HOY." },
  { title: "Dinero rápido 💸", text: "Juega solo 2 minutos más y triplicarás tu dinero. GARANTIZADO." },
  { title: "Amigos ganando 🌟", text: "Tu amigo ganó $50 hace 5 minutos. ¡Vos también podes!" },
  { title: "¡RETIRO PENDIENTE! 🏦", text: "Antes de retirar, tenés un giro gratis exclusivo. ¡Usalo ahora!" },
  { title: "OFERTA LIMITADA ⏱️", text: "Multiplicá tu premio por 5x con un depósito mínimo." },
  { title: "¡CUIDADO! ⚠️", text: "Estás a punto de dejar tu premio en la mesa. Juega una vez más para asegurar." },
  { title: "VIP STATUS 🌟", text: "Ganaste estatus VIP por hoy. Juegos gratis disponibles." },
  { title: "JACKPOT ACUMULADO 💰", text: "El pozo acaba de subir. ¡Es tu oportunidad de llevarte todo!" },
  // Mensajes de terminos.html
  { title: "¡ABURRIDO! 😴", text: "¿Rellenar formularios? ¡Mejor es ganar dinero! Volvé a jugar ahora." },
  { title: "OFERTA FLASH ⚡", text: "Depositá ahora y te damos un 200% extra. ¡No dejes pasar esta oportunidad!" },
  { title: "ESTÁS PERDIENDO TIEMPO ⏳", text: "Mientras vos rellenás esto, otros están ganando. ¡No te quedes atrás!" },
  { title: "¡CASI LO TENÉS! 🤑", text: "Solo un paso más y el premio es tuyo... ¿o preferís volver y duplicarlo?" },
  { title: "¡NO LEAS, JUGÁ! 🛑", text: "Nadie lee los términos. ¡Aceptá y empezá a ganar ya mismo!" },
  { title: "REGALO SORPRESA 🎁", text: "Dejá de llenar datos y girá la ruleta. ¡Te espera un premio gigante!" },
  { title: "¡ALERTA DE GANANCIA! 🚨", text: "Un jugador de tu ciudad acaba de ganar $5000. ¡No pierdas tu turno!" },
  { title: "BONO DE BIENVENIDA 💰", text: "Tu bono se va a vencer si no terminás rápido. ¡Apurate!" },
  { title: "¿DUDAS? 🤔", text: "No lo pienses tanto. ¡El dinero fácil está a un clic de distancia!" }
];

// Función encargada de abrir una ventana emergente REAL (nueva ventana del navegador)
const openRealPopup = (title, text) => {
  // Calculamos una posición aleatoria (left y top) para que las ventanas aparezcan dispersas por toda la pantalla
  const winLeft = Math.random() * 400 + 100;
  const winTop = Math.random() * 300 + 100;
  
  // Abrimos la nueva ventana sin barra de herramientas ni menú para que parezca más un anuncio
  const popupWin = window.open("", "_blank", `width=480,height=320,left=${winLeft},top=${winTop},toolbar=no,menubar=no`);
  
  if (popupWin) {
      // Determinamos la ruta base dependiendo de si estamos en la carpeta /html/ o en la raíz
      const baseUrl = window.location.href.includes('/html/') ? '../index.html' : 'index.html';
      
      // Inyectamos el diseño HTML y CSS directamente en la nueva ventana
      popupWin.document.title = title;
      popupWin.document.body.style.margin = "0";
      popupWin.document.write(`
          <div style="background: #0b0918; color: #f9f4ff; font-family: sans-serif; text-align: center; padding: 2rem; height: 100vh; box-sizing: border-box;">
              <h2 style="color: #ec4899; text-shadow: 0 0 18px rgba(223, 82, 255, 0.3); margin-top: 0;">${title}</h2>
              <p style="color: #b0a8cb; font-size: 1.2rem;">${text}</p>
              <!-- El botón de Jugar redirige a la ruleta en la ventana original y cierra el popup -->
              <button onclick="if(window.opener) { window.opener.location.href='${baseUrl}'; } window.close()" style="background: linear-gradient(135deg, #ec4899, #8b5cf6, #22d3ee); color: white; border: none; padding: 12px 24px; border-radius: 20px; cursor: pointer; font-weight: bold; margin-top: 20px;">JUGAR MÁS</button>
              <button onclick="window.close()" style="background: #333; color: white; border: none; padding: 12px 24px; border-radius: 20px; cursor: pointer; font-weight: bold; margin-top: 20px; margin-left: 10px;">CERRAR</button>
          </div>
      `);
      popupWin.document.close();
  }
};

// Muestra un único popup al azar basado en una probabilidad (chance)
window.showCasinoPopupRandom = (chance = 0.6) => {
  // Genera un número entre 0 y 1. Si es menor a la probabilidad, ejecuta el código
  if (Math.random() < chance) {
    const randomMsg = casinoMessages[Math.floor(Math.random() * casinoMessages.length)];
    openRealPopup(randomMsg.title, randomMsg.text);
  }
};

// Muestra un popup garantizado (el primero de la lista)
window.showCasinoPopup = () => {
    const randomMsg = casinoMessages[0];
    openRealPopup(randomMsg.title, randomMsg.text);
};

// Variable global para contar cuántos popups hemos mostrado y no colapsar infinitamente la PC
let popupShownCount = 0;

// Función principal para spamear al usuario mientras está en la página
window.startAggressivePopups = (interval = 2000, maxPopups = 20, chance = 0.6) => {
    let lastPopupTime = 0;

    const attemptPopup = () => {
        const currentTime = Date.now();
        
        // Verificamos si pasó el tiempo del intervalo, si no superamos el máximo y el check de probabilidad
        if (currentTime - lastPopupTime > interval && popupShownCount < maxPopups && Math.random() < chance) {
            // Generamos una RÁFAGA de popups simultáneos (entre 1 y 3 ventanas a la vez)
            const burstCount = Math.floor(Math.random() * 3) + 1;
            
            for (let i = 0; i < burstCount; i++) {
                if (popupShownCount < maxPopups) {
                    const randomMsg = casinoMessages[Math.floor(Math.random() * casinoMessages.length)];
                    openRealPopup(randomMsg.title, randomMsg.text);
                    popupShownCount++;
                }
            }
            lastPopupTime = currentTime;
        }
    };

    // Escuchamos interacciones reales del usuario para burlar el bloqueador de popups del navegador
    document.addEventListener('click', attemptPopup);
    document.addEventListener('keydown', attemptPopup);
};

// Evento que se ejecuta al cargar la página (actualmente solo maneja los viejos modales si todavía existieran en algún archivo HTML)
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('casino-modal');
  const closeModal = document.getElementById('close-modal');
  const playNow = document.getElementById('play-now');

  const openModal = () => modal?.classList?.add('visible');
  const closePopup = () => modal?.classList?.remove('visible');

  closeModal?.addEventListener('click', closePopup);
  playNow?.addEventListener('click', closePopup);
});
