const opcionesPosibles = [
  "frutas",
  "capitales",
  "animales",
  "trabajos",
  "peliculas",
  "superheroes",
];

// Función para obtener el parámetro de la URL
function obtenerParametroURL(nombre) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(nombre);
}

fetch("diccionario.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("La solicitud del diccionario no fue exitosa");
    }
    return response.json();
  })
  .then((data) => {
    let palabras = [];
    let letras_usadas = [];
    let palabra_elegida, largo;
    let errores_cont, aciertos_cont;
    let acerto = false,
      random = false;

    const generarPalabraNueva = (event) => {
      if (event.key == "Enter" || event.key == " ") {
        iniciar();
      }
    };
    //detecta si se presiono una letra en el teclado
    const presionoTecla = (event, palabra) => {
      analizarTeclaPresionada(event, palabra_elegida);
    };

    // Obtener el valor del parámetro
    const parametroURL = obtenerParametroURL("catg");

    // Verificar si el valor existe y está incluido en opcionesPosibles
    if (
      parametroURL &&
      opcionesPosibles.includes(parametroURL) &&
      parametroURL != "rand"
    ) {
      // Usar el valor del parámetro URL como 'opcion'
      palabras = data[parametroURL];
    } else {
      random = true;

      if (
        parametroURL &&
        !opcionesPosibles.includes(parametroURL) &&
        parametroURL != "rand"
      ) {
        console.warn("La categoria no existe, se selecciono una aleatoria");
      }
    }

    const atril = document.getElementById("imagen");

    //boton 'Generar Palabra'
    const reiniciar = document.getElementById("jugar");

    //inicia y reinicia el juego si se presiona enter o el boton 'Generar Palabra'
    iniciar();
    reiniciar.addEventListener("click", iniciar);

    function iniciar() {
      if (random) {
        // Selecciona una categoria aleatoria
        palabras =
          data[
            opcionesPosibles[
              Math.floor(Math.random() * opcionesPosibles.length)
            ]
          ];
      }

      //evita que se pueda generar otra palabra hasta que termine el juego
      reiniciar.disabled = true;
      document.removeEventListener("keydown", generarPalabraNueva);

      //reinicia las variables
      atril.src = "assets/atril/img0.png";
      largo = 0;
      errores_cont = 0;
      aciertos_cont = 0;
      letras_usadas = [];

      const parrafo = document.getElementById("palabra_a_adivinar");
      parrafo.innerHTML = "";

      //crea los spans para los errores
      const letrasErradas = document.getElementById("errores");
      letrasErradas.innerHTML = "";
      for (let x = 0; x < 7; x++) {
        letrasErradas.appendChild(document.createElement("span"));
      }

      //elije una palabra aleatoria
      //palabra_elegida = palabras[Math.floor(Math.random() * palabras.length)];

      let pruebas = ["abcd", "harry potter y la piedra filosofal"];
      palabra_elegida = pruebas[Math.floor(Math.random() * pruebas.length)];

      //crea lo guiones para cada letra de la palabra
      for (let i = 0; i < palabra_elegida.length; i++) {
        let guion = parrafo.appendChild(document.createElement("span"));
        if (palabra_elegida[i] == " ") {
          guion.style.width = "0";
          guion.style.marginRight = "3vh";
        } else {
          largo++;
        }
      }

      document.addEventListener("keydown", presionoTecla);
    }

    function analizarTeclaPresionada(event, palabra_elegida) {
      acerto = false;
      const spans_palabra = document.querySelectorAll(
        "#palabra_a_adivinar span"
      );
      const spans_errores = document.querySelectorAll("#errores span");

      //si la letra esta en la palabra
      let tecla = event.key.toLowerCase();

      for (let x = 0; x < palabra_elegida.length; x++) {
        if (
          (tecla == palabra_elegida[x].toLowerCase() ||
            (tecla == "a" && palabra_elegida[x].toLowerCase() == "á") ||
            (tecla == "e" && palabra_elegida[x].toLowerCase() == "é") ||
            (tecla == "i" && palabra_elegida[x].toLowerCase() == "í") ||
            (tecla == "o" && palabra_elegida[x].toLowerCase() == "ó") ||
            (tecla == "u" && palabra_elegida[x].toLowerCase() == "ú")) &&
          letras_usadas.indexOf(tecla) == -1
        ) {
          spans_palabra[x].innerHTML = palabra_elegida[x].toUpperCase();
          aciertos_cont++;
          letras_usadas.push(tecla);

          acerto = true;
        }
      }

      //si la letra no esta en la palabra
      if (
        acerto == false &&
        tecla.match(/^[a-z]$/) &&
        letras_usadas.indexOf(tecla) == -1
      ) {
        spans_errores[errores_cont].innerHTML = tecla.toUpperCase();
        atril.src = "assets/atril/img" + errores_cont + ".png";
        errores_cont++;

        letras_usadas.push(tecla);
      }

      if (errores_cont == 7) {
        //muestra cual era la palabra
        for (let x = 0; x < palabra_elegida.length; x++) {
          spans_palabra[x].innerHTML = palabra_elegida[x].toUpperCase();
        }
        habilitarVolverJugar();
      } else if (aciertos_cont >= largo) {
        atril.src = "assets/atril/win.png";
        habilitarVolverJugar();
      }
    }

    function habilitarVolverJugar() {
      document.removeEventListener("keydown", presionoTecla);
      document.addEventListener("keydown", generarPalabraNueva);
      reiniciar.disabled = false;
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });
