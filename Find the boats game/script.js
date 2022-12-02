"use strict";

let arrayBarcos = [];
let barcosEncontrados = 0;
const MAXIMO_BARCOS = 5;
let tamano = 0;
let fallos = 0;

document.addEventListener("DOMContentLoaded", () => {
  crearFormulario();
});

const crearFormulario = () => {
  // Se crean las etiquetas
  const titulo = document.createElement("h2");
  const texto = document.createElement("label");
  const input = document.createElement("input");
  const formBt = document.createElement("button");

  // Atributos titulo
  titulo.textContent = "Juego Barcos";

  // Atributos parrafos
  texto.textContent = "Introduzca la edad";

  // Atributos input
  input.setAttribute("id", "ageField");
  input.setAttribute("type", "text");
  input.setAttribute("name", "edad");
  input.setAttribute("placeholder", "Introduca edad");

  // Atributos boton
  formBt.setAttribute("class", "submit");
  formBt.setAttribute("id", "botonForm");
  formBt.setAttribute("onclick", "startGame()");
  formBt.textContent = "Empezar";

  // Se crea el div contenedor
  const divForm = document.createElement("div");

  // Se añade el div al documento
  document.body.appendChild(divForm);

  // Se añaden los elementos al div contenedor
  divForm.appendChild(titulo);
  divForm.appendChild(texto);
  divForm.appendChild(input);
  divForm.appendChild(formBt);
};

const startGame = () => {
  let edadInt = checkAge();
  if (edadInt != null) {
    crearJuego(edadInt);
  }
};

const checkAge = () => {
  let edad = parseInt(document.querySelector("#ageField").value);
  let result = null;
  if (!isNaN(edad) && edad > 0) {
    result = edad;
  }
  return result;
};

const crearJuego = (edad) => {
  tamano = 5;
  if (edad > 12) {
    tamano = 10;
  }

  arrayBarcos = posBarcos(tamano);
  console.table(arrayBarcos);

  const divTab = document.createElement("div");
  divTab.setAttribute("id", "tablero");
  document.body.appendChild(divTab);

  const fallosLabel = document.createElement("label");
  fallosLabel.setAttribute("id", "fallos");
  fallosLabel.textContent = `Número de fallos: ${fallos}`;
  divTab.appendChild(fallosLabel);

  const table = document.createElement("table");
  divTab.appendChild(table);

  let contador = 1;
  for (let i = 1; i <= tamano; i++) {
    const tr = document.createElement("tr");
    table.appendChild(tr);
    for (let j = 1; j <= tamano; j++) {
      const td = document.createElement("td");

      td.setAttribute("id", "casilla" + contador);
      td.setAttribute("class", "casilla");
      td.setAttribute("onclick", `showImg(${contador})`);
      tr.appendChild(td);

      contador++;
    }
  }

  const formBt = document.querySelector("#botonForm");
  formBt.setAttribute("onclick", "resetGame()");
  formBt.textContent = "Reiniciar";
};

const posBarcos = (tamano) => {
  let array = [];
  for (let i = 1; i <= MAXIMO_BARCOS; i++) {
    let num = parseInt(Math.floor(Math.random() * (tamano * tamano)) + 1);
    while (array.includes(num) && MAXIMO_BARCOS <= tamano * tamano) {
      num = parseInt(Math.floor(Math.random() * (tamano * tamano)) + 1);
    }
    array.push(num);
  }
  return array;
};

const showImg = (id) => {
  const casilla = document.querySelector("#casilla" + id);
  const img = document.createElement("img");
  id = parseInt(id);
  if (arrayBarcos.includes(id)) {
    img.setAttribute("src", "./imgs/barco.jpg");
    barcosEncontrados++;
  } else {
    img.setAttribute("src", "./imgs/agua.jpg");
    fallos++;
    contadorFallos(fallos);
  }
  casilla.appendChild(img);
  casilla.removeAttribute("onclick");
  if (barcosEncontrados == MAXIMO_BARCOS) {
    resetGame();
  }
};

const resetGame = () => {
  alert(`¡Enhorabuena!, conseguiste encontrar todos los barcos. Tuviste un total de: ${fallos} fallos.`)
  let continuar = confirm("¿Desea jugar otra partida?");

  if (continuar == true) {
    let contador = 1;

    for (let i = 1; i <= tamano; i++) {
      for (let j = 1; j <= tamano; j++) {
        const td = document.querySelector("#casilla" + contador);

        td.setAttribute("onclick", `showImg(${contador})`);
        if(td.childElementCount == 1) {
          td.removeChild(td.firstChild);
        }
        contador++;
      }
    }
    arrayBarcos = posBarcos(tamano);
    fallos = 0;
    barcosEncontrados = 0;
    contadorFallos(fallos);
  }
};

const contadorFallos = (fallos) => {
  const fallosLabel = document.querySelector("#fallos");
  fallosLabel.textContent = `Número de fallos: ${fallos}`;
  return fallosLabel;
}