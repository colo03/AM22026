const COLORES = [
  "#E53935",
  "#FF9800",
  "#4CAF50",
  "#7B1FA2",
  "#FFD600",
  "#F8F8F8",
  "#1565C0",
  "#00897B",
  "#D81B60",
  "#5D4037",
];

const DURACION_MS = 2500;

const opciones = [
  { etiqueta: "$100", color: COLORES[0], resultado: "Juego 1", url: "https://www.youtube.com/" },
  { etiqueta: "$700", color: COLORES[1], resultado: "Juego 2", url: "index.html" },
  { etiqueta: "$15", color: COLORES[2], resultado: "Juego 3", url: "https://example.com/3" },
  { etiqueta: "$1500", color: COLORES[3], resultado: "Juego 4", url: "https://example.com/4" },
  { etiqueta: "$1000", color: COLORES[4], resultado: "Juego 5", url: "https://example.com/5" },
  { etiqueta: "$50", color: COLORES[5], resultado: "Juego 6", url: "https://example.com/6" },
  { etiqueta: "$400", color: COLORES[6], resultado: "Juego 7", url: "https://example.com/7" },
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
    p.shuffle(opciones, true);
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
    p.background(255,255,255);

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
      p.stroke(255);
      p.strokeWeight(2);

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

    p.fill(250);
    p.noStroke();
    p.circle(centroX, centroY, radio * 0.22);
  }

  function dibujarPuntero() {
    let posX = centroX;
    let posY = centroY - radio - 20;

    p.fill("black");
    p.noStroke();

    // Draw a downward-pointing arrow at the top of the wheel.
    p.triangle(
      posX - 18, posY,
      posX + 18, posY,
      posX, posY + 30
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
      p.fill(60);
      if (opciones.length === 0) {
        p.text("No quedan opciones. Reiniciá la página para jugar otra vez.", centroX, p.height - 30);
      } else {
        p.text("Tocá para girar la ruleta", centroX, p.height - 30);
      }
    }

    if (girando) {
      p.fill(100);
      p.text("Girando", centroX, p.height - 30);
    }
  }

  function dibujarPopup() {

    p.push();

    p.fill(0, 0, 0, opacidadPopup * 0.5);
    p.rect(0, 0, p.width, p.height);

    let anchoCaja = Math.min(p.width * 0.8, 400);
    let altoCaja = 160;

    let posX = centroX - anchoCaja / 2;
    let posY = centroY - altoCaja / 2;

    p.fill(255, 255, 255, opacidadPopup);
    p.rect(posX, posY, anchoCaja, altoCaja, 14);

    p.fill(40, 40, 40, opacidadPopup);
    p.textAlign(p.CENTER, p.CENTER);
    p.textStyle(p.BOLD);
    p.textSize(18);

    p.text("Tu desafio", centroX, posY + 40);

    p.textSize(14);
    p.textStyle(p.NORMAL);
    p.textAlign(p.CENTER)

    p.text(ganador ? ganador.resultado : "", centroX, posY + 100);
    p.pop();
  }

  p.mousePressed = function () {

    if (mostrarPopup) {
      if (ganador && ganador.url) {
        window.open(ganador.url, '_blank');
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