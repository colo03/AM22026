const COLORES = [
  "rgba(236, 72, 153, 0.65)", // Pink de neón con 65% de opacidad
  "rgba(139, 92, 246, 0.65)", // Purple de neón con 65% de opacidad
  "rgba(34, 211, 238, 0.65)", // Cyan de neón con 65% de opacidad
  "rgba(244, 63, 94, 0.65)",  // Rose con 65% de opacidad
  "rgba(234, 179, 8, 0.65)",  // Yellow con 65% de opacidad
  "rgba(20, 184, 166, 0.65)",  // Teal con 65% de opacidad
];

const DURACION_MS = 2500;

const opciones = [
  { etiqueta: "$5000", color: COLORES[0], resultado: "Jugar Snake", url: "html/snake.html" },
  { etiqueta: "$10", color: COLORES[1], resultado: "Jugar Pong", url: "html/pong.html" },
  { etiqueta: "$100", color: COLORES[2], resultado: "Jugar Breakout", url: "html/breakout.html" },
  { etiqueta: "$10000", color: COLORES[3], resultado: "Jugar Flappy", url: "html/flapy.html" },
  { etiqueta: "$500", color: COLORES[4], resultado: "Jugar Catch", url: "html/catch.html" },
  { etiqueta: "$50", color: COLORES[5], resultado: "Jugar Dodger", url: "html/dodger.html" },
];

new p5(function (p) {

  let anguloActual = 0;
  let anguloInicial = 0;
  let giroTotal = 0;

  let girando = false;
  let tiempoInicio = 0;

  let ganador = null;
  let winnerIndex = null; // index chosen randomly for the current spin
  let mostrarPopup = false;
  let opacidadPopup = 0;

  let centroX, centroY, radio;

  let imagenFondoRuleta;

  p.preload = function () {
    // Reemplazá por la ruta real de tu PNG circular general
    imagenFondoRuleta = p.loadImage("/recursos/ruleta.png"); 
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    calcularDimensiones();
    p.textFont("sans-serif");
    p.imageMode(p.CENTER);
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    calcularDimensiones();
  };

  function calcularDimensiones() {
    centroX = p.width / 2;
    centroY = p.height / 2;
    radio = Math.min(p.width, p.height) / 2 - 60;
  }

  p.draw = function () {
    p.clear(); // Clear the background to let the CSS dark gradient show through

    if (girando) {
      let tiempoPasado = p.millis() - tiempoInicio;
      let progreso = p.constrain(tiempoPasado / DURACION_MS, 0, 1);

      let suavizado = 1 - Math.pow(1 - progreso, 5);

      anguloActual = (anguloInicial + giroTotal * suavizado) % p.TWO_PI;

      if (progreso >= 1) {
        girando = false;
        determinarGanador();
      }
    }

if (imagenFondoRuleta) {
      p.push();
      p.translate(centroX, centroY); // Movemos el origen al centro de la ruleta
      p.rotate(anguloActual);        // Rotamos el lienzo según el ángulo de giro
      p.image(imagenFondoRuleta, 0, 0, radio * 2, radio * 2); // Dibujamos en (0,0) relativo
      p.pop();
    }

    dibujarRuleta();
    dibujarPuntero();
    dibujarTextoInferior();

    if (mostrarPopup) {
      opacidadPopup = p.constrain(opacidadPopup + 8, 0, 255);
      dibujarPopup();
    }
  };

  function dibujarRuleta() {
    let cantidad = opciones.length;

    if (cantidad === 0) return;

    let porcion = p.TWO_PI / cantidad;
    let textoSize = Math.max(12, radio / 10);

    // --- EFECTO VISUAL CLAVE ---
    // Cambiamos el modo de fusión para que el color interactúe con el PNG de atrás.
    // Opciones geniales: p.MULTIPLY (oscurece/tinta), p.SCREEN (ilumina), p.ADD (brillo neón extremo)
    p.blendMode(p.ADD); 

    for (let i = 0; i < cantidad; i++) {
      let inicio = anguloActual + i * porcion - p.HALF_PI;
      let fin = inicio + porcion;

      // El color ahora tiene transparencia (definida arriba en el array con rgba)
      p.fill(opciones[i].color);
      p.stroke("#090912"); // Separadores de gajos
      p.strokeWeight(3);

      p.arc(centroX, centroY, radio * 2, radio * 2, inicio, fin, p.PIE);
    }

    // --- RESTAURAR MODO DE FUSIÓN ---
    // Es vital volver a BLEND para que los textos, puntero y popups se dibujen normal
    p.blendMode(p.BLEND);

    // Dibujamos los textos por encima en una pasada limpia
    for (let i = 0; i < cantidad; i++) {
      let inicio = anguloActual + i * porcion - p.HALF_PI;
      let anguloMedio = inicio + porcion / 2;

      let posX = centroX + Math.cos(anguloMedio) * radio * 0.65;
      let posY = centroY + Math.sin(anguloMedio) * radio * 0.65;

      p.push();
      p.translate(posX, posY);
      p.rotate(anguloMedio + p.HALF_PI);
      p.textAlign(p.CENTER, p.CENTER);
      p.noStroke();
      p.fill(255); // Texto siempre blanco para que contraste con el efecto
      p.textSize(textoSize);
      p.textStyle(p.BOLD);
      p.text(opciones[i].etiqueta, 0, 0);
      p.pop();
    }

    // Centro de la ruleta (Neon ring)
    p.fill("#090912");
    p.stroke("#22d3ee");
    p.strokeWeight(3);
    p.circle(centroX, centroY, radio * 0.25);
    p.fill("#ffffff");
    p.noStroke();
    p.circle(centroX, centroY, radio * 0.08);
  }

  // [El resto de las funciones: dibujarPuntero, determinarGanador, dibujarPopup, mousePressed se mantienen exactamente iguales al original]
  function dibujarPuntero() {
    let posX = centroX;
    let posY = centroY - radio - 25;
    p.fill("#ec4899"); p.stroke("#ffffff"); p.strokeWeight(2);
    p.triangle(posX - 20, posY, posX + 20, posY, posX, posY + 35);
  }

  function determinarGanador() {
    if (opciones.length === 0) { ganador = null; mostrarPopup = false; return; }
    let cantidad = opciones.length;
    let porcion = p.TWO_PI / cantidad;
    let anguloRelativo = (p.TWO_PI - anguloActual) % p.TWO_PI;
    let indice = Math.floor(anguloRelativo / porcion) % cantidad;
    ganador = opciones[indice]; winnerIndex = null; mostrarPopup = true; opacidadPopup = 0;
  }

  function dibujarTextoInferior() {
    p.textAlign(p.CENTER, p.CENTER); p.noStroke(); p.textStyle(p.BOLD); p.textSize(16);
    if (!girando && !mostrarPopup) {
      p.fill("#a9adc8");
      if (opciones.length === 0) p.text("No quedan opciones.", centroX, p.height - 30);
      else p.text("TOCÁ PARA GIRAR LA RULETA", centroX, p.height - 30);
    }
    if (girando) { p.fill("#8b5cf6"); p.text("GIRANDO...", centroX, p.height - 30); }
  }

  function dibujarPuntero() {
    let posX = centroX;
    let posY = centroY - radio - 25;

    p.fill("#ec4899");
    p.stroke("#ffffff");
    p.strokeWeight(2);

    // Draw a downward-pointing arrow at the top of the wheel.
    p.triangle(
      posX - 20, posY,
      posX + 20, posY,
      posX, posY + 35
    );
  }

  function determinarGanador() {
    if (opciones.length === 0) {
      ganador = null;
      mostrarPopup = false;
      return;
    }

    let cantidad = opciones.length;
    let porcion = p.TWO_PI / cantidad;
    let anguloRelativo = (p.TWO_PI - anguloActual) % p.TWO_PI;

    // Compute the slice currently under the top pointer.
    let indice = Math.floor(anguloRelativo / porcion) % cantidad;

    ganador = opciones[indice];
    winnerIndex = null;

    mostrarPopup = true;
    opacidadPopup = 0;
  }

  function dibujarTextoInferior() {

    p.textAlign(p.CENTER, p.CENTER);
    p.noStroke();
    p.textStyle(p.BOLD);
    p.textSize(16);

    if (!girando && !mostrarPopup) {
      p.fill("#a9adc8"); // var(--muted) from CSS
      if (opciones.length === 0) {
        p.text("No quedan opciones. Reiniciá la página para jugar otra vez.", centroX, p.height - 30);
      } else {
        p.text("TOCÁ PARA GIRAR LA RULETA", centroX, p.height - 30);
      }
    }

    if (girando) {
      p.fill("#8b5cf6"); // var(--accent) from CSS
      p.text("GIRANDO...", centroX, p.height - 30);
    }
  }


function dibujarPopup() {
  p.push();

  // 1. Windows 98 Light Screen Dither/Dimming (Instead of a heavy modern dark tint)
  p.fill(0, 0, 0, opacidadPopup * 0.15); 
  p.noStroke();
  p.rect(0, 0, p.width, p.height);

  let anchoCaja = Math.min(p.width * 0.8, 440);
  let altoCaja = 240; // Expanded slightly to comfortably fit the Win98 Titlebar

  let posX = centroX - anchoCaja / 2;
  let posY = centroY - altoCaja / 2;

  // 2. Main Window Background (Face Color: #c0c0c0)
  p.fill(192, 192, 192, opacidadPopup);
  p.noStroke();
  p.rect(posX, posY, anchoCaja, altoCaja);

  // 3. Classic 3D Window Bevel Borders (Outer White, Inner Dark Grey, Bottom-Right Black)
  p.strokeWeight(1);
  
  // Highlighting Top and Left edges (White)
  p.stroke(255, 255, 255, opacidadPopup);
  p.line(posX, posY, posX + anchoCaja, posY);
  p.line(posX, posY, posX, posY + altoCaja);
  p.line(posX + 1, posY + 1, posX + anchoCaja - 1, posY + 1);
  p.line(posX + 1, posY + 1, posX + 1, posY + altoCaja - 1);

  // Shadow Bottom and Right edges (Dark Grey)
  p.stroke(128, 128, 128, opacidadPopup);
  p.line(posX + 1, posY + altoCaja - 2, posX + anchoCaja - 2, posY + altoCaja - 2);
  p.line(posX + anchoCaja - 2, posY + 1, posX + anchoCaja - 2, posY + altoCaja - 2);

  // Ultimate Shadow Outer Bottom and Right edges (Black)
  p.stroke(10, 10, 10, opacidadPopup);
  p.line(posX, posY + altoCaja - 1, posX + anchoCaja - 1, posY + altoCaja - 1);
  p.line(posX + anchoCaja - 1, posY, posX + anchoCaja - 1, posY + altoCaja - 1);

  // 4. Windows 98 Titlebar (Gradient Blue)
  let marginTitle = 4;
  let altoTitlebar = 20;
  p.noStroke();
  // Simulating the 90s gradient (Active window color)
  for (let i = 0; i < (anchoCaja - marginTitle * 2); i++) {
    let inter = p.map(i, 0, anchoCaja - marginTitle * 2, 0, 1);
    let c = p.lerpColor(p.color(0, 0, 128), p.color(16, 132, 208), inter);
    p.stroke(c);
    p.line(posX + marginTitle + i, posY + marginTitle, posX + marginTitle + i, posY + marginTitle + altoTitlebar);
  }

  // Titlebar Text
  p.noStroke();
  p.fill(255, 255, 255, opacidadPopup);
  p.textSize(11);
  p.textStyle(p.BOLD);
  p.textAlign(p.LEFT, p.CENTER);
  p.text("¡Premio Obtenido!", posX + marginTitle + 6, posY + marginTitle + altoTitlebar / 2);

  // 5. Text Contents & Internal Styling
  p.textAlign(p.CENTER, p.CENTER);
  
  // Badge (Flat Slate Gray Inset Badge)
  let badgeY = posY + 45;
  p.fill(128, 128, 128, opacidadPopup);
  p.rect(centroX - 60, badgeY, 120, 20); // Sharp rectangle
  p.fill(255, 255, 255, opacidadPopup);
  p.textSize(11);
  p.textStyle(p.BOLD);
  p.text("JUGÁS POR:", centroX, badgeY + 10);

  // Title (Win98 System text style)
  p.fill(0, 0, 0, opacidadPopup);
  p.textSize(24);
  p.textStyle(p.BOLD);
  p.text(ganador ? ganador.etiqueta : "", centroX, posY + 100);

  // Subtitle
  p.textSize(12);
  p.textStyle(p.NORMAL);
  p.text(ganador ? ganador.resultado : "", centroX, posY + 140);

  // 6. Windows 3D Command Button (Replaces the pink rounded neon button)
  let btnW = 140;
  let btnH = 28;
  let btnX = centroX - btnW / 2;
  let btnY = posY + 180;

  // Button Face
  p.fill(192, 192, 192, opacidadPopup);
  p.noStroke();
  p.rect(btnX, btnY, btnW, btnH);

  // Button 3D Borders
  p.strokeWeight(1);
  // Highlight
  p.stroke(255, 255, 255, opacidadPopup);
  p.line(btnX, btnY, btnX + btnW - 1, btnY);
  p.line(btnX, btnY, btnX, btnY + btnH - 1);
  // Shadow
  p.stroke(128, 128, 128, opacidadPopup);
  p.line(btnX + 1, btnY + btnH - 2, btnX + btnW - 2, btnY + btnH - 2);
  p.line(btnX + btnW - 2, btnY + 1, btnX + btnW - 2, btnY + btnH - 2);
  // Black Outer Shadow
  p.stroke(10, 10, 10, opacidadPopup);
  p.line(btnX, btnY + btnH - 1, btnX + btnW - 1, btnY + btnH - 1);
  p.line(btnX + btnW - 1, btnY, btnX + btnW - 1, btnY + btnH - 1);

  // Button Interactive Focus Indicator (The classic dotted rect interior)
  p.stroke(0, 0, 0, opacidadPopup * 0.4);
  p.drawingContext.setLineDash([1, 2]); // Native canvas dotted pattern simulation
  p.noFill();
  p.rect(btnX + 3, btnY + 3, btnW - 6, btnH - 6);
  p.drawingContext.setLineDash([]); // Reset line dash pattern

  // Button Label
  p.noStroke();
  p.fill(0, 0, 0, opacidadPopup);
  p.textSize(12);
  p.textStyle(p.BOLD);
  p.textAlign(p.CENTER, p.CENTER);
  p.text("ACEPTAR", centroX, btnY + btnH / 2);

  p.pop();
}


  p.mousePressed = function () {

    if (mostrarPopup) {
      if (ganador && ganador.url) {
        window.open(ganador.url, '_self');
      }
      mostrarPopup = false;
      ganador = null;
      return;
    }

    if (!girando && opciones.length > 0) {
      anguloInicial = anguloActual;
      winnerIndex = Math.floor(Math.random() * opciones.length);

      let cantidad = opciones.length;
      let porcion = p.TWO_PI / cantidad;
      // Align the randomly chosen slice under the top pointer.
      let finalAngle =
        (- (winnerIndex + 0.5) * porcion + p.TWO_PI) % p.TWO_PI;

      let vueltas = p.TWO_PI * (5 + Math.random() * 5);
      let ajuste = (finalAngle - anguloInicial + p.TWO_PI) % p.TWO_PI;

      giroTotal = vueltas + ajuste;
      tiempoInicio = p.millis();
      girando = true;
    }
  };

  function calcularBrilloHex(hex) {

    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    return 0.299 * r + 0.587 * g + 0.114 * b;
  }

});