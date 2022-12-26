"use strict";

const NUM_JUGADORES = 2;
const NUM_BOLOS = 10;
const NUM_JUGADAS = 10;

let numBolosEnPie = NUM_BOLOS;
let idJugTurno = 0;
let tiradasRestantes = 0;
let jugadoresAcabados = 0;

let tiradasUsadas = 0;

$(() => {
  crearInicio();
});

const crearInicio = () => {
  // Crea la tabla y los elementos necesarios para la ejecución
  $(document.createElement("div")).attr("id", "divTabla").appendTo('body');
  $(document.createElement("table")).attr("id", "tabla").appendTo('#divTabla');

  for (let i = 1; i <= NUM_JUGADORES; i++) {
    crearMenuJugador(i);
  }

  $(document.createElement("button")).text("Empezar").attr("id", "botonCom").on("click", comenzarJuego).appendTo('#divTabla');
};

const crearMenuJugador = (idJug) => {
  // Crea el marcador de cada jugador
  $(document.createElement("tr")).attr("id", `tr${idJug}`).appendTo('#tabla');

  $(document.createElement("th")).text("Jugadores").appendTo(`#tr${idJug}`);
  $(document.createElement("th")).text("Puntuación").appendTo(`#tr${idJug}`);
  $(document.createElement("th")).text("Jugadas").appendTo(`#tr${idJug}`);
  $(document.createElement("th")).text("Tiradas").appendTo(`#tr${idJug}`);
  $(document.createElement("th")).text("Turno").appendTo(`#tr${idJug}`);


  $(document.createElement("tr")).attr("id", `trJug${idJug}`).appendTo('#tabla');

  $(document.createElement("td")).text(`Jugador${idJug}`).attr("id", `nombre${idJug}`).appendTo(`#trJug${idJug}`);
  $(document.createElement("td")).text(`0`).attr("id", `puntos${idJug}`).appendTo(`#trJug${idJug}`);
  $(document.createElement("td")).text(`${NUM_JUGADAS}`).attr("id", `jugadas${idJug}`).appendTo(`#trJug${idJug}`);
  $(document.createElement("td")).text(`2`).attr("id", `tiradas${idJug}`).appendTo(`#trJug${idJug}`);
};

const comenzarJuego = () => {
  // Al usar el botón se inicia el juego
  generarPrimero();
  $("#botonCom").off("click", comenzarJuego);
  generarBolos();
};

const generarPrimero = () => {
  // Se genera el jugador inicial y se le asigna la bola
  idJugTurno = Math.floor(Math.random() * NUM_JUGADORES) + 1;
  crearBola();
};

const crearBola = () => {
  // Crea la bola y se la añade al jugador
  $(document.createElement("img")).attr("id", "bola").attr("src", "./imgs/bola.png").on("click", usarBola).appendTo(`#trJug${idJugTurno}`);
  $(`#trJug${idJugTurno}`).attr("class", "activo");
};

const generarBolos = () => {
  // Genera los bolos para la partida
  $(document.createElement("div")).attr("id", "divBolos").appendTo('body');

  for (let i = 1; i <= NUM_BOLOS; i++) {
    $(document.createElement("img")).attr("id", `bolo${i}`).attr("src", "./imgs/bolo.png").appendTo('#divBolos');
  }
};

const usarBola = () => {
  // Aquí se gestiona la tirada
  let resultado = false;
  tiradasRestantes = parseInt($(`#tiradas${idJugTurno}`).text());
  
  // Si le quedan tiradas ejecuta el lanzamiento
  if (tiradasRestantes > 0) {
    resultado = ejecutarLanzamiento();
    tiradasRestantes--;
    $(`#tiradas${idJugTurno}`).text(tiradasRestantes);
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
    $(`#tiradas${idJugTurno}`).text(tiradasRestantes);
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
          $(`#bolo${idBolo}`).attr("src", "./imgs/boloTirado.png");
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
    let src = $(`#bolo${i}`).attr("src");
    if (src == "./imgs/bolo.png") {
      if (id == 0) {
        id = i;
      }
    }
  }
  return id;
};

const cargarPuntos = (bolosTir) => {
  // Añade los puntos obtenidos al marcardor del jugador
  let numPuntos = parseInt($(`#puntos${idJugTurno}`).text());
  numPuntos = numPuntos + bolosTir;
  $(`#puntos${idJugTurno}`).text(numPuntos);
};

const reiniciarBolos = () => {
  // Reinicia los bolos a su estado original
  for (let i = 1; i <= NUM_BOLOS; i++) {
    $(`#bolo${i}`).attr("src", "./imgs/bolo.png");
  }
  numBolosEnPie = NUM_BOLOS;
  tiradasUsadas = 0;
};

const siguienteJugada = () => {
  // La jugada pasa al siguiente jugador

  // Primero la quita la bola al actual
  $("#bola").off("click", usarBola);
  $("#bola").remove();
  $(".activo").removeAttr("class");

  let numJug = parseInt($(`#jugadas${idJugTurno}`).text());

  // Si le quedan jugadas actualiza su marcador
  if (numJug != 0) {
    $(`#jugadas${idJugTurno}`).text(numJug - 1);
    $(`#tiradas${idJugTurno}`).text(2);
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
  // Revisa si el jugador tiene turnos o tiradas
  if (parseInt($(`#jugadas${idJugTurno}`).text()) == 0 && parseInt($(`#tiradas${idJugTurno}`).text()) == 0) {
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
  $("#bola").remove();
  $(".activo").removeAttr("class");
  // Muestra al ganador
  swal(buscarMaxPunt());
};

const buscarMaxPunt = () => {
  let maxPunt = 0;
  let idRes = 0;
  // Busca al jugador con la máximo puntuación
  for (let i = 1; i <= NUM_JUGADORES; i++) {
    let punt = parseInt($(`#puntos${i}`).text());
    if (punt > maxPunt) {
      maxPunt = punt;
      idRes = i;
    }
  }
  // Devuelve al ganador y sus puntos
  return `El ${$(`#nombre${idRes}`).text()} es el ganador con una puntuación de ${maxPunt} puntos`;
};