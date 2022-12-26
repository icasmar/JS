"use strict";

const NUM_JUGADORES = 2;
const NUM_BOLOS = 10;
const NUM_JUGADAS = 10;

let numBolosEnPie = NUM_BOLOS;
let idJugTurno = 0;
let tiradasRestantes = 0;
let jugadoresAcabados = 0;

let tiradasUsadas = 0;

document.addEventListener("DOMContentLoaded", () => {
  crearInicio();
});

const crearInicio = () => {
  // Crea la tabla y los elementos necesarios para la ejecución
  const table = document.createElement("table");
  const div = document.createElement("div");
  div.setAttribute("id", "divTabla");

  document.body.appendChild(div);
  div.appendChild(table);

  for (let i = 1; i <= NUM_JUGADORES; i++) {
    crearMenuJugador(table, i);
  }

  const botonCom = document.createElement("button");
  botonCom.setAttribute("id", "botonCom");
  botonCom.addEventListener("click", comenzarJuego);
  botonCom.textContent = "Empezar";

  div.appendChild(botonCom);
};

const crearMenuJugador = (table, idJug) => {
  // Crea el marcador de cada jugador
  const trTh = document.createElement("tr");
  const th1 = document.createElement("th");
  const th2 = document.createElement("th");
  const th3 = document.createElement("th");
  const th4 = document.createElement("th");
  const th5 = document.createElement("th");

  th1.textContent = "Jugadores";
  th2.textContent = "Puntuación";
  th3.textContent = "Jugadas";
  th4.textContent = "Tiradas";
  th5.textContent = "Turno";

  trTh.appendChild(th1);
  trTh.appendChild(th2);
  trTh.appendChild(th3);
  trTh.appendChild(th4);
  trTh.appendChild(th5);

  table.appendChild(trTh);

  const trTd = document.createElement("tr");
  trTd.setAttribute("id", `trJug${idJug}`);

  const nombre = document.createElement("td");
  const puntos = document.createElement("td");
  const jugadas = document.createElement("td");
  const tiradas = document.createElement("td");

  nombre.textContent = `Jugador${idJug}`;
  nombre.setAttribute("id", `nombre${idJug}`);

  puntos.textContent = "0";
  puntos.setAttribute("id", `puntos${idJug}`);

  jugadas.textContent = `${NUM_JUGADAS}`;
  jugadas.setAttribute("id", `jugadas${idJug}`);

  tiradas.textContent = "2";
  tiradas.setAttribute("id", `tiradas${idJug}`);

  trTd.appendChild(nombre);
  trTd.appendChild(puntos);
  trTd.appendChild(jugadas);
  trTd.appendChild(tiradas);

  table.appendChild(trTd);
};

const comenzarJuego = () => {
  // Al usar el botón se inicia el juego
  generarPrimero();
  const boton = document.getElementById("botonCom");
  boton.removeEventListener("click", comenzarJuego);
  generarBolos();
};

const generarPrimero = () => {
  // Se genera el jugador inicial y se le asigna la bola
  idJugTurno = Math.floor(Math.random() * NUM_JUGADORES) + 1;
  crearBola();
};

const crearBola = () => {
  // Crea la bola y se la añade al jugador
  const tr = document.getElementById(`trJug${idJugTurno}`);
  const img = document.createElement("img");

  img.setAttribute("id", "bola");
  img.setAttribute("src", "./imgs/bola.png");
  img.addEventListener("click", usarBola);
  tr.appendChild(img);
  tr.setAttribute("class", "activo");
};

const generarBolos = () => {
  // Genera los bolos para la partida
  const divBolos = document.createElement("div");
  divBolos.setAttribute("id", "divBolos");

  for (let i = 1; i <= NUM_BOLOS; i++) {
    const bolo = document.createElement("img");
    bolo.setAttribute("id", `bolo${i}`);
    bolo.setAttribute("src", "./imgs/bolo.png");
    divBolos.appendChild(bolo);
  }
  document.body.appendChild(divBolos);
};

const usarBola = () => {
  // Aquí se gestiona la tirada
  let resultado = false;
  const tiradasJugador = document.getElementById(`tiradas${idJugTurno}`);
  tiradasRestantes = parseInt(tiradasJugador.textContent);

  // Si le quedan tiradas ejecuta el lanzamiento
  if(tiradasRestantes > 0) {
    resultado = ejecutarLanzamiento();
    tiradasRestantes--;
    tiradasJugador.textContent = tiradasRestantes;
    tiradasUsadas++;
  }

  // Si se han tirado todos los bolos se comprueba
  if (resultado == true) {
    // Si solo ha usado 1 tirada es Strike
    if (tiradasUsadas == 1) {
      tiradasRestantes += 2;
      swal("¡Strike!, +2 tiradas");
    } 
    // Si ha usado 2 tiradas es Spare
    else if (tiradasUsadas == 2) {
      tiradasRestantes++;
      swal("¡Spare!, +1 tiradas");
    }
    // Se actualiza el marcador y se reincian los bolos
    tiradasJugador.textContent = tiradasRestantes;
    reiniciarBolos();
    tiradasUsadas = 0;
  }

  // Si no le quedan tiradas revisa los jugadores
  if (tiradasRestantes == 0) {
    revisarJugador();
  }
};

const ejecutarLanzamiento = () => {
  // Ejecuta el lanzamiento
  let res = null;

  // Si hay bolos en pie comienza el lanzamiento
  if (numBolosEnPie > 0) {
    res = false;
    let tirados = Math.floor(Math.random() * (numBolosEnPie + 1));
    //let tirados = NUM_BOLOS; //Probar Strike
    //let tirados = NUM_BOLOS/2; //Probar Spare

    // Si se han tirado bolos
    if (tirados > 0) {
      if (tirados >= numBolosEnPie) {
        tirados = numBolosEnPie;
        res = true;
      }
      // Busca y tira el número de bolos
      for (let i = 1; i <= tirados; i++) {
        let idBolo = getIdPrimBoloEnPie();
        if (idBolo != 0) {
          tirarBolo(idBolo);
          numBolosEnPie--;
        }
      }
      swal(`Ha derribado ${tirados} bolos`);
      cargarPuntos(tirados);
    } else {
      swal("No se han derribado bolos");
    }
  }
  return res;
};

const getIdPrimBoloEnPie = () => {
  // Busca el primer bolo en pie y devuelve su ID
  let id = 0;
  for (let i = 1; i <= NUM_BOLOS; i++) {
    const bolo = document.getElementById(`bolo${i}`);
    let src = bolo.getAttribute("src");
    if (src == "./imgs/bolo.png") {
      if (id == 0) {
        id = i;
      }
    }
  }
  return id;
};

const tirarBolo = (id) => {
  // Cambia la imagen del bolo caido a tirado
  const bolo = document.getElementById(`bolo${id}`);
  bolo.setAttribute("src", "./imgs/boloTirado.png");
};

const cargarPuntos = (bolosTir) => {
  // Añade los puntos obtenidos al marcardor del jugador
  const puntos = document.getElementById(`puntos${idJugTurno}`);
  let numPuntos = parseInt(puntos.textContent);
  numPuntos = numPuntos + bolosTir;
  puntos.textContent = numPuntos;
};

const reiniciarBolos = () => {
  // Reinicia los bolos a su estado original
  for (let i = 1; i <= NUM_BOLOS; i++) {
    const bolo = document.getElementById(`bolo${i}`);
    bolo.setAttribute("src", "./imgs/bolo.png");
  }
  numBolosEnPie = NUM_BOLOS;
  tiradasUsadas = 0;
};

const siguienteJugada = () => {
  // La jugada pasa al siguiente jugador

  // Primero la quita la bola al actual
  const tr = document.getElementById(`trJug${idJugTurno}`);
  const bola = document.getElementById("bola");
  bola.removeEventListener("click", usarBola);
  tr.removeChild(bola);
  tr.removeAttribute("class");

  const jugadas = document.getElementById(`jugadas${idJugTurno}`);
  const tiradas = document.getElementById(`tiradas${idJugTurno}`);

  // Si le quedan jugadas actualiza su marcador
  if (parseInt(jugadas.textContent) != 0) {
    jugadas.textContent = parseInt(jugadas.textContent) - 1;
    tiradas.textContent = 2;
  }

  // Calcula quién es el siguiente
  if (idJugTurno == NUM_JUGADORES) {
    idJugTurno = 1;
  } else {
    idJugTurno++;
  }

  // Le da la bola y pone los bolos
  crearBola();
  reiniciarBolos();
};

const revisarJugador = () => {
  const jugadasRes = document.getElementById(`jugadas${idJugTurno}`);
  const tiradasRes = document.getElementById(`tiradas${idJugTurno}`);

  // Revisa si el jugador tiene turnos o tiradas
  if (parseInt(jugadasRes.textContent) == 0 && parseInt(tiradasRes.textContent) == 0) {
    // Si no tiene lo cuenta como que ha terminado
    jugadoresAcabados++;
    // Si todos los jugadores han terminado finaliza el juego
    if (jugadoresAcabados >= NUM_JUGADORES) {
      terminarJuego();
    } else {
      siguienteJugada();
    }
  } else {
    siguienteJugada();
  }
};

const terminarJuego = () => {
  // Le quita la bola al último jugador y termina el juego
  reiniciarBolos();
  const trBola = document.getElementById(`trJug${idJugTurno}`);
  trBola.removeAttribute("class");
  const bola = document.getElementById("bola");

  trBola.removeChild(bola);
  // Muestra al ganador
  swal(buscarMaxPunt());
};

const buscarMaxPunt = () => {
  let maxPunt = 0;
  let idRes = 0;
  // Busca al jugador con la máximo puntuación
  for (let i = 1; i <= NUM_JUGADORES; i++) {
    const jug = document.getElementById(`puntos${i}`);
    if (parseInt(jug.textContent) > maxPunt) {
      maxPunt = parseInt(jug.textContent);
      idRes = i;
    }
  }
  const nomJug = document.getElementById(`nombre${idRes}`);
  // Devuelve al ganador y sus puntos
  return `El ${nomJug.textContent} es el ganador con una puntuación de ${maxPunt} puntos`;
};