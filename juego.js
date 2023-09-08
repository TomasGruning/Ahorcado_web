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
    let palabra_elegida;
    let errores_cont, aciertos_cont;
    let acerto = false,
      random = false;

    const generarPalabraNueva = (event) => {
      if (event.key == "Enter" || event.key == " ") {
        iniciar();
      }
    };
    //detecta si se presiono una letra en el teclado
    const presionoTecla = (event) => {
      analizarTeclaPresionada(event, palabra_elegida.replace(/ /g, ""));
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
      palabra_elegida = palabras[Math.floor(Math.random() * palabras.length)];

      // Divide la palabra en palabras separadas por espacios
      const palabrasSeparadas = palabra_elegida.split(" ");

      //crea los spans para las palabras y letras
      for (let i = 0; i < palabrasSeparadas.length; i++) {
        const palabraSpan = document.createElement("span");
        parrafo.appendChild(palabraSpan);

        // Divide cada palabra en letras
        const letras = palabrasSeparadas[i].split("");
        for (let j = 0; j < letras.length; j++) {
          const letraSpan = document.createElement("span");
          palabraSpan.appendChild(letraSpan);
        }
      }

      document.addEventListener("keydown", presionoTecla);
    }

    function analizarTeclaPresionada(event, palabra_elegida) {
      acerto = false;
      const spans_palabra = document.querySelectorAll(
        "#palabra_a_adivinar span span" // Cambiado el selector
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
          spans_palabra[x].textContent = palabra_elegida[x].toUpperCase();
          aciertos_cont++;

          acerto = true;
        }
      }

      //si la letra no esta en la palabra
      if (
        tecla.match(/^[a-z]$/) &&
        letras_usadas.indexOf(tecla) == -1
      ) {
        if(!acerto){
          spans_errores[errores_cont].innerHTML = tecla.toUpperCase();
          errores_cont++;
          atril.src = "assets/atril/img" + errores_cont + ".png";
        }
        //agrega la tecla a las teclas usadas
        letras_usadas.push(tecla);
      }

      if (errores_cont == 7) {
        //muestra cual era la palabra
        for (let x = 0; x < palabra_elegida.length; x++) {
          spans_palabra[x].innerHTML = palabra_elegida[x].toUpperCase();
        }
        habilitarVolverJugar();
      } else if (aciertos_cont >= palabra_elegida.length) {
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
