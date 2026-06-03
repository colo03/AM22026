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
  const winLeft = Math.random() * 400 + 100;
  const winTop = Math.random() * 300 + 100;
  
  // Outer window size (slightly larger to leave a space margin around the box)
  const popupWin = window.open("", "_blank", `width=440,height=240,left=${winLeft},top=${winTop},toolbar=no,menubar=no`);
  
  if (popupWin) {
      const baseUrl = window.location.href.includes('/html/') ? '../index.html' : 'index.html';
      
      popupWin.document.title = "System Message";
      popupWin.document.body.style.margin = "0";
      popupWin.document.body.style.padding = "0";
      
      // 1. REUSING THE BACKGROUND: Replicated the exact CSS starry space styles 
      popupWin.document.body.style.background = "#000033";
      popupWin.document.body.style.backgroundImage = `
        radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 40px),
        radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 30px)
      `;
      popupWin.document.body.style.backgroundSize = "240px 240px";
      popupWin.document.body.style.backgroundPosition = "0 0, 120px 120px";
      
      // Full screen flex layout to keep the dialog window centered
      popupWin.document.body.style.height = "100vh";
      popupWin.document.body.style.display = "flex";
      popupWin.document.body.style.alignItems = "center";
      popupWin.document.body.style.justifyContent = "center";
      popupWin.document.body.style.overflow = "hidden";
      
      // 2. SMALL BOX: Constrained container acting as the standalone popup window
      popupWin.document.write(`
          <div style="width: 400px; height: 180px; box-sizing: border-box; font-family: Tahoma, Arial, sans-serif; background: #c0c0c0; color: #000000; border: 2px solid; border-color: #ffffff #808080 #808080 #ffffff; box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.7), inset 1px 1px 0px #ffffff, inset -1px -1px 0px #0a0a0a; display: flex; flex-direction: column; padding: 3px;">
              
              <div style="background: linear-gradient(90deg, #000080, #1084d0); padding: 3px 4px 3px 6px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #ffffff;">
                  <span style="color: #ffffff; font-weight: bold; font-size: 11px; letter-spacing: 0.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 340px;">${title}</span>
                  <div onclick="window.close()" style="background: #c0c0c0; border: 1px solid; border-color: #ffffff #808080 #808080 #ffffff; font-size: 9px; font-weight: bold; padding: 0px 4px; cursor: pointer; line-height: 11px; color: #000000;">X</div>
              </div>
              
              <div style="padding: 12px; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;">
                  <p style="margin: 0 0 10px 0; font-size: 12px; line-height: 1.4; color: #000000; font-weight: normal; text-align: left;">${text}</p>
                  
                  <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: auto;">
                      
                      <button onclick="if(window.opener) { window.opener.location.href='${baseUrl}'; } window.close()" style="background: #c0c0c0; color: #000000; border: 2px solid; border-color: #ffffff #808080 #808080 #ffffff; box-shadow: inset 1px 1px 0px #ffffff; padding: 4px 14px; cursor: pointer; font-family: Tahoma, Arial, sans-serif; font-size: 11px; font-weight: bold; outline: 1px dotted #000000; outline-offset: -4px;">JUGAR MÁS</button>
                      
                      <button onclick="window.close()" style="background: #c0c0c0; color: #000000; border: 2px solid; border-color: #ffffff #808080 #808080 #ffffff; box-shadow: inset 1px 1px 0px #ffffff; padding: 4px 14px; cursor: pointer; font-family: Tahoma, Arial, sans-serif; font-size: 11px; font-weight: normal;">CERRAR</button>
                  
                  </div>
              </div>
          </div>
      `);
      popupWin.document.close();
  }
};

// Muestra un único popup al azar basado en una probabilidad (chance)
window.showCasinoPopupRandom = (chance = 0.6) => {
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
        
        if (currentTime - lastPopupTime > interval && popupShownCount < maxPopups && Math.random() < chance) {
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