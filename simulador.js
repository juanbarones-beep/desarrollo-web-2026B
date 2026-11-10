/* ===========================================================================
   CÁMARA DE COMERCIO DE CASANARE - SISTEMA INTEGRADO (JS)
   =========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    /* =======================================================================
       1. CONTADOR DE REGISTROS (Formulario de Contacto - index.html)
       ======================================================================= */
    const formContacto = document.getElementById("contactenos");
    const contadorElemento = document.getElementById("contador");

    if (formContacto && contadorElemento) {
        let totalRegistrados = 0;

        formContacto.addEventListener("submit", (evento) => {
            evento.preventDefault();

            const correo = document.getElementById("correo")?.value.trim();
            const nombre = document.getElementById("nombre")?.value.trim();

            if (!correo || !nombre) {
                alert("Por favor, complete todos los campos obligatorios del formulario de contacto.");
                return;
            }

            totalRegistrados++;
            contadorElemento.textContent = totalRegistrados;
            
            alert(`¡Mensaje guardado con éxito, ${nombre}!`);
            formContacto.reset();
        });
    }

    /* =======================================================================
       2. LÓGICA DEL FORMULARIO DE TRÁMITES Y JURISDICCIÓN (empresas.html)
       ======================================================================= */
    const radiosPersona = document.querySelectorAll('input[name="tipoPersona"]');
    const organizacionDiv = document.getElementById('organizacionJuridica');
    const organizacionSelect = document.getElementById('organizacion');

    if (radiosPersona.length > 0 && organizacionDiv && organizacionSelect) {
        radiosPersona.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'juridica') {
                    organizacionDiv.style.display = 'block';
                    organizacionSelect.required = true;
                } else {
                    organizacionDiv.style.display = 'none';
                    organizacionSelect.required = false;
                    organizacionSelect.value = "";
                }
            });
        });
    }

    const formEmpresas = document.querySelector('form[action="registro.php"]');
    if (formEmpresas) {
        formEmpresas.addEventListener("submit", (evento) => {
            const camara = document.getElementById("ccomercio")?.value;
            
            if (camara && camara !== "cc5") {
                const confirmar = confirm("Ha seleccionado una Cámara de Comercio diferente a la de Casanare. ¿Desea continuar con el registro?");
                if (!confirmar) {
                    evento.preventDefault();
                    return;
                }
            }
        });
    }

    /* =======================================================================
       3. MÓDULO DE CÁLCULO DE COSTOS / TARIFAS DE REGISTRO MERCANTIL
       ======================================================================= */
    const municipiosCasanare = [
        "Yopal", "Aguazul", "Tauramena", "Monterrey", 
        "Villanueva", "Paz de Ariporo", "Maní", "Hato Corozal"
    ];

    function calcularTarifaEstimada(tipoPersona, tipoTramite) {
        const TARIFA_BASE = 65000;
        let factor = 1.0;

        if (tipoPersona === "juridica") {
            factor += 0.5;
        }

        switch (tipoTramite) {
            case "tip1":
                factor *= 1.2;
                break;
            case "tip2":
                factor *= 1.0;
                break;
            case "tip3":
                factor *= 0.6;
                break;
            case "tip4":
                factor *= 0.4;
                break;
            default:
                factor *= 1.0;
        }

        return TARIFA_BASE * factor;
    }

    /* =======================================================================
       4. CALCULADORA DE PROYECCIÓN DE INGRESOS EMPRESARIALES
       ======================================================================= */
    const btnCalcular = document.getElementById("btnCalcularProyeccion");
    const selectSector = document.getElementById("sectorEmpresa");
    const inputCantidad = document.getElementById("cantidadComercios");
    const textResultado = document.getElementById("resultadoProyeccion");

    if (btnCalcular && selectSector && inputCantidad && textResultado) {
        btnCalcular.addEventListener("click", () => {
            const sector = selectSector.value;
            const cantidad = parseInt(inputCantidad.value) || 1;
            
            let ingresoBaseMensual = 0;

            switch (sector) {
                case "comercio":
                    ingresoBaseMensual = 15000000;
                    break;
                case "servicios":
                    ingresoBaseMensual = 22000000;
                    break;
                case "agro":
                    ingresoBaseMensual = 35000000;
                    break;
                default:
                    ingresoBaseMensual = 10000000;
            }

            const ingresoTotalMensual = ingresoBaseMensual * cantidad;
            const ingresoAnual = ingresoTotalMensual * 12;

            textResultado.textContent = `$${ingresoTotalMensual.toLocaleString("es-CO")} COP / mes ($${ingresoAnual.toLocaleString("es-CO")} COP / año)`;
        });
    }

    /* =======================================================================
       5. REGISTRO DINÁMICO DE NUEVOS COMERCIOS (TABLA INTERACTIVA)
       ======================================================================= */
    const negocios = [
       { nombre: "Supermercado La 40", municipio: "Yopal", sector: "Comercio al por menor" },
       { nombre: "Servicios Petroleros Casanare", municipio: "Tauramena", sector: "Servicios" }
    ];

    const cuerpoTablaNegocios = document.querySelector("#cuerpotabla-negocios");
    const resumenNegocios = document.querySelector("#resumen-negocios");
    const formularioNegocio = document.querySelector("#form-negocio");
    const avisoNegocio = document.querySelector("#aviso-negocio");

    function pintarTablaNegocios() {
       if (!cuerpoTablaNegocios) return; 
       cuerpoTablaNegocios.textContent = "";

       for (const negocio of negocios) {
          const fila = document.createElement("tr");

          const datos = [negocio.nombre, negocio.municipio, negocio.sector];
          for (const dato of datos) {
             const celda = document.createElement("td");
             celda.textContent = dato;
             fila.appendChild(celda);
          }

          const celdaEstado = document.createElement("td");
          celdaEstado.textContent = "Activo / Formalizado";
          celdaEstado.style.color = "green";
          celdaEstado.style.fontWeight = "bold";
          fila.appendChild(celdaEstado);

          cuerpoTablaNegocios.appendChild(fila);
       }

       resumenNegocios.textContent = `Total de comercios registrados en esta sesión: ${negocios.length}`;
    }

    function mostrarErrorNegocio(idCampo, mensaje) {
       const span = document.getElementById("error-" + idCampo);
       if(span) span.textContent = mensaje;
       return mensaje !== "" ? 1 : 0; 
    }

    function validarFormularioNegocio() {
       let errores = 0;

       const nombre = document.getElementById("nombreNegocio")?.value.trim();
       if (nombre === "") {
          errores += mostrarErrorNegocio("nombreNegocio", "Escriba el nombre del comercio.");
       } else if (nombre && nombre.length < 3) {
          errores += mostrarErrorNegocio("nombreNegocio", "El nombre es demasiado corto.");
       } else {
          mostrarErrorNegocio("nombreNegocio", "");
       }

       const municipio = document.getElementById("municipioNegocio")?.value;
       if (municipio === "") {
          errores += mostrarErrorNegocio("municipioNegocio", "Seleccione un municipio válido.");
       } else {
          mostrarErrorNegocio("municipioNegocio", "");
       }

       const sector = document.getElementById("sectorNegocio")?.value;
       if (sector === "") {
          errores += mostrarErrorNegocio("sectorNegocio", "Seleccione el sector predominante.");
       } else {
          mostrarErrorNegocio("sectorNegocio", "");
       }

       return errores;
    }

    if (formularioNegocio) {
        formularioNegocio.addEventListener("submit", function(evento) {
           evento.preventDefault();
        
           const cantidadErrores = validarFormularioNegocio();
        
           if (cantidadErrores > 0) {
              avisoNegocio.textContent = `Revise los campos marcados (${cantidadErrores} errores).`;
              avisoNegocio.style.color = "red";
              return; 
           }
        
           negocios.push({
              nombre: document.getElementById("nombreNegocio").value.trim(),
              municipio: document.getElementById("municipioNegocio").value,
              sector: document.getElementById("sectorNegocio").value
           });
        
           pintarTablaNegocios();
           formularioNegocio.reset();
           
           avisoNegocio.style.color = "green";
           avisoNegocio.textContent = "Comercio agregado exitosamente a la Cámara de Comercio.";
        });
        
        ["nombreNegocio", "municipioNegocio", "sectorNegocio"].forEach(campo => {
           document.getElementById(campo)?.addEventListener("input", validarFormularioNegocio);
        });
        
        pintarTablaNegocios();
    }
});