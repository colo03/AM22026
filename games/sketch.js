const COLORES = [
  "#ec4899", // Neon Pink
  "#8b5cf6", // Neon Purple
  "#22d3ee", // Neon Cyan
  "#f43f5e", // Rose
  "#eab308", // Yellow
  "#14b8a6", // Teal
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

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    calcularDimensiones();
    p.textFont("sans-serif");
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

    if (cantidad === 0) {
      // If there are no options left, show an empty wheel state.
      p.fill(240);
      p.noStroke();
      p.circle(centroX, centroY, radio * 2);
      p.fill(60);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(16);
      p.text("Sin opciones", centroX, centroY);
      return;
    }

    let porcion = p.TWO_PI / cantidad;

    let textoSize = Math.max(12, radio / 10);

    for (let i = 0; i < cantidad; i++) {

      let inicio = anguloActual + i * porcion - p.HALF_PI;
      let fin = inicio + porcion;

      p.fill(opciones[i].color);
      p.stroke("#090912"); // Dark background color to separate slices
      p.strokeWeight(4);

      p.arc(centroX, centroY, radio * 2, radio * 2, inicio, fin, p.PIE);

      let anguloMedio = inicio + porcion / 2;

      let posX = centroX + Math.cos(anguloMedio) * radio * 0.65;
      let posY = centroY + Math.sin(anguloMedio) * radio * 0.65;

      p.push();
      p.translate(posX, posY);
      p.rotate(anguloMedio + p.HALF_PI);

      p.textAlign(p.CENTER, p.CENTER);
      p.noStroke();

      let brillo = calcularBrilloHex(opciones[i].color);
      p.fill(brillo > 170 ? 30 : 255);

      p.textSize(textoSize);
      p.textStyle(p.BOLD);
      p.text(opciones[i].etiqueta, 0, 0);

      p.pop();
    }

    // Center hub styled like a neon ring
    p.fill("#090912");
    p.stroke("#22d3ee");
    p.strokeWeight(3);
    p.circle(centroX, centroY, radio * 0.25);
    p.fill("#ffffff");
    p.noStroke();
    p.circle(centroX, centroY, radio * 0.08);
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

    // Dark overlay like CSS .modal-overlay
    p.fill(6, 6, 16, opacidadPopup * 0.82);
    p.rect(0, 0, p.width, p.height);

    let anchoCaja = Math.min(p.width * 0.8, 440);
    let altoCaja = 220;

    let posX = centroX - anchoCaja / 2;
    let posY = centroY - altoCaja / 2;

    // Modal background like CSS .modal-popup
    p.fill(11, 9, 24, opacidadPopup * 0.93);
    p.stroke(139, 92, 246, opacidadPopup); // Purple border
    p.strokeWeight(2);
    p.rect(posX, posY, anchoCaja, altoCaja, 28); // 28px border radius

    p.noStroke();
    
    // Badge
    p.fill(255, 255, 255, opacidadPopup * 0.06);
    p.rect(centroX - 70, posY + 20, 140, 24, 12);
    p.fill(211, 197, 255, opacidadPopup);
    p.textSize(12);
    p.textStyle(p.BOLD);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Juga Por:", centroX, posY + 32);

    // Title
    p.fill(249, 244, 255, opacidadPopup);
    p.textSize(32);
    p.text(ganador ? ganador.etiqueta : "", centroX, posY + 75);

    // Subtitle
    p.textSize(14);
    p.fill(176, 168, 203, opacidadPopup); // Muted text
    p.textStyle(p.NORMAL);
    p.text(
      ganador ? ganador.resultado : "",
      centroX,
      posY + 120,
    );

    // Fake Button (Neon style)
    p.fill(236, 72, 153, opacidadPopup); // Pink button background
    p.rect(centroX - 90, posY + 155, 180, 40, 20);
    p.fill(255, 255, 255, opacidadPopup);
    p.textSize(14);
    p.textStyle(p.BOLD);
    p.text("JUGAR AHORA", centroX, posY + 175);

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