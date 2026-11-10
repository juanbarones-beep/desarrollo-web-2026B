/* ===========================================================================
   DESARROLLO WEB (FI20064) · Grupo G3 · Periodo 2026B
   Semana 7 — EJEMPLO DIRIGIDO: el DOM, los eventos y la validación dinámica

   Continúa el simulador de la Semana 6. Allí el resultado salía por la
   consola; aquí sale en la página. Esa es toda la diferencia que introduce
   el DOM: el programa deja de hablarle al programador y le habla al usuario.

   Se construye en cinco pasos. Cada uno funciona por su cuenta: ejecute,
   mire el resultado en el navegador y solo entonces siga al siguiente.
   =========================================================================== */

/* ---------------------------------------------------------------------------
   PASO 0 · Los datos
   Los mismos lotes de la Semana 6. Siguen siendo un arreglo de objetos: el
   DOM no cambia cómo se guardan los datos, solo cómo se muestran.
   --------------------------------------------------------------------------- */
const lotes = [
   { vereda: "Cupiagua", hectareas: 12.5, bultoPorha: 45 },
   { vereda: "Monterralo", hectareas: 8.0, bultoPorha: 35 },
   { vereda: "San José", hectareas: 20.0, bultoPorha: 55 },
   { vereda: "Unete", hectareas: 5.5, bultoPorha: 41 },

];

const cuerpoTabla = document.querySelector("#cuerpotabla");
const resumen = document.querySelector("#resumen");
const formulario = document.querySelector("#form-lote");
const aviso = document.querySelector("#aviso");

const botonGuardar = document.querySelector("#btn-guardar");

function clasificar(bultosPorha) {
   if (bultosPorha >= 50) return {texto:"Excelente", clase: "alto"};
   if (bultosPorha >= 40) return {texto:"Bueno", clase: "medio"};
   if (bultosPorha >= 30) return {texto:"Regular", clase: "bajo"};
   return {texto:"Bajo", clase: "critico"};
}

function pintarTabla() {

   cuerpoTabla.textContent = "";

   let produccionTotal = 0;

   for (const lote of lotes) {
      const produccion = lote.hectareas * lote.bultoPorha;
      produccionTotal += produccion;

      const fila = document.createElement("tr");

      const datos = [
         lote.vereda,
         lote.hectareas.toString(),
         lote.bultoPorha.toString(),
         produccion.toLocaleString("es-CO") + " bultos"
      ];
      for (const dato of datos) {
         const celda = document.createElement("td");
         celda.textContent = dato;
         fila.appendChild(celda);
      }

      const estado = clasificar(lote.bultoPorha);
      const celdaEstado = document.createElement("td");
      celdaEstado.textContent = estado.texto;
      celdaEstado.classList.add("estado", estado.clase);
      fila.appendChild(celdaEstado);

      cuerpoTabla.appendChild(fila);
   }

function pintarTabla() {
   for (const lote of lotes) {
   }

   resumen.textContent = 
     lotes.length + " lotes registrados * produccion total estimada:" +
       produccionTotal.toLocaleString("es-CO") + " bultos";

}

formulario.addEventListener("submit", function(evento) {
   evento.preventDefault();

   const errores = validar();

   if (errores.length > 0) {
      aviso.textContent = "Revise los campos marcados:" + errores.length +
         (errores.length === 1 ? " error" : " errores");
      aviso.classList.add("aviso-error");
   }


   lotes.push({
      vereda: document.querySelector("vereda").value.trim(),
      hectareas: Number(document.querySelector("hectareas").value),
      bultoPorha: Number(document.querySelector("rendimiento").value)
   });

   pintarTabla();
   formulario.reset();
   aviso.classList.remove("aviso-error");
   aviso.textContent = "Lote agregado.";
});

function mostrarError(idCampo, mensaje) {
   const campo = document.getElementById(idCampo);
   const span = document.getElementById("error-" + idCampo);
   span.textContent = mensaje;

}

function validar() {
   const errores = [];

   const vereda = document.getElementById("vereda").value.trim();
   if (vereda === "") {
      errores.push(mostrarError("vereda", "Escriba el nombre de la vereda"));
   } else if (vereda.length < 3) {
      errores.push(mostrarError("vereda", "El nombre es demasiado corto"));
   } else {
      mostrarError("vereda", "");
   }

   const hectareas = Number(document.getElementById("hectareas").value);
   if (!(hectareas > 0)) {
      errores.push(mostrarError("hectareas", "Las hectareas deben ser mayor que cero."));
   } else {
      mostrarError("hectareas", "");
   }

   const rendimiento = Number(document.getElementById("rendimiento").value);
   if (!(rendimiento > 0)) {
      errores.push(mostrarError("rendimiento", "Escriba el rendimiento en bultos por hectárea."));
   } else if (rendimiento < 120) {
      errores.push(mostrarError("rendimiento", "Un rendimiento a 120 no es verossímil; verifique el dato."));
   } else {
      mostrarError("rendimiento", "");
   }

   return errores;
}

for (const campo of ["vereda", "hectareas", "rendimiento"]) {
   document.getElementById(campo).addEventListener("input", validar);
}

pintarTabla();