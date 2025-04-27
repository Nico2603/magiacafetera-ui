// --- NUEVA LÓGICA PARA PLANIFICADOR FLEXIBLE ---

// 1. Estructura de Datos de Componentes Disponibles
const componentesDisponibles = {
    destinos: [
        { id: 'destino-pdc', nombre: 'Parque del Café', descripcion: 'Entrada general', precio: 86000, categoria: 'Destino' },
        { id: 'destino-panaca', nombre: 'PANACA', descripcion: 'Pasaporte Terra', precio: 110000, categoria: 'Destino' },
        { id: 'destino-ukumari', nombre: 'Bioparque Ukumarí', descripcion: 'Pasaporte Adulto', precio: 49000, categoria: 'Destino' },
        { id: 'destino-consota', nombre: 'Parque Consotá', descripcion: 'Entrada Particular', precio: 36800, categoria: 'Destino' }
    ],
    transporte: [
        { id: 'trans-compartido', nombre: 'Transporte Compartido', descripcion: 'Van o bus grupal (precio por día)', precio: 50000, categoria: 'Transporte' },
        { id: 'trans-privado', nombre: 'Transporte Privado', descripcion: 'Vehículo exclusivo (precio por día)', precio: 150000, categoria: 'Transporte' },
        { id: 'trans-chiva', nombre: 'Chiva Tradicional', descripcion: 'Experiencia folclórica (precio por día)', precio: 90000, categoria: 'Transporte' },
        { id: 'trans-propio', nombre: 'Vehículo Propio', descripcion: 'No requiere servicio', precio: 0, categoria: 'Transporte' }
    ],
    hospedaje: [
        { id: 'hosp-hotel-3', nombre: 'Hotel 3 Estrellas', descripcion: 'Estándar con desayuno (precio por noche)', precio: 180000, categoria: 'Hospedaje' },
        { id: 'hosp-hotel-4', nombre: 'Hotel 4 Estrellas', descripcion: 'Superior con más servicios (precio por noche)', precio: 280000, categoria: 'Hospedaje' },
        { id: 'hosp-finca', nombre: 'Finca Cafetera Típica', descripcion: 'Experiencia rural (precio por noche)', precio: 220000, categoria: 'Hospedaje' },
        { id: 'hosp-ninguno', nombre: 'Sin Hospedaje', descripcion: 'Ya tengo dónde quedarme', precio: 0, categoria: 'Hospedaje' }
    ],
    alimentacion: [
        { id: 'alim-desayuno', nombre: 'Solo Desayunos', descripcion: '(precio por día)', precio: 30000, categoria: 'Alimentación' },
        { id: 'alim-media', nombre: 'Media Pensión', descripcion: 'Desayuno y cena (precio por día)', precio: 70000, categoria: 'Alimentación' },
        { id: 'alim-completa', nombre: 'Pensión Completa', descripcion: 'Desayuno, almuerzo y cena (precio por día)', precio: 110000, categoria: 'Alimentación' },
        { id: 'alim-ninguna', nombre: 'Sin Plan de Comidas', descripcion: 'Comeré por mi cuenta', precio: 0, categoria: 'Alimentación' }
    ],
    guias: [
        { id: 'guia-basico', nombre: 'Guía Básico Local', descripcion: 'Para recorridos específicos (precio por día)', precio: 80000, categoria: 'Guía' },
        { id: 'guia-experto', nombre: 'Guía Experto Bilingüe', descripcion: 'Acompañamiento completo (precio por día)', precio: 200000, categoria: 'Guía' },
        { id: 'guia-ninguno', nombre: 'Sin Guía Turístico', descripcion: 'Exploraré por mi cuenta', precio: 0, categoria: 'Guía' }
    ],
    extras: [
        { id: 'extra-fotografia', nombre: 'Fotografía Profesional', descripcion: 'Sesión de fotos en 1 destino (precio único)', precio: 150000, categoria: 'Extra' },
        { id: 'extra-barismo', nombre: 'Taller de Barismo', descripcion: 'Aprende a preparar café (precio único)', precio: 60000, categoria: 'Extra' },
        { id: 'extra-cabalgata', nombre: 'Cabalgata Ecológica', descripcion: 'Paseo a caballo (2h) (precio único)', precio: 90000, categoria: 'Extra' },
        { id: 'extra-termales', nombre: 'Visita a Termales', descripcion: 'Entrada y transporte básico (precio único)', precio: 120000, categoria: 'Extra' }
    ]
};

// 2. Estado del Plan Actual
let planActual = { // Ahora es un objeto para más estructura
    componentes: [], // Array de IDs de componentes seleccionados
    numeroViajeros: 1,
    fechaViaje: null,
    duracionDias: 1 // Nueva propiedad para duración
};
let costoTotalActual = 0;


// --- Funciones Auxiliares ---
function encontrarComponente(id) {
    for (const categoria in componentesDisponibles) {
        const componente = componentesDisponibles[categoria].find(comp => comp.id === id);
        if (componente) return componente;
    }
    return null;
}

function formatearPrecio(precio) {
    // Asegurarse que el precio sea un número antes de formatear
    const numPrecio = Number(precio);
    if (isNaN(numPrecio)) {
        return 'N/A'; // O algún valor por defecto
    }
    return numPrecio.toLocaleString('es-CO');
}

// --- Lógica de Renderizado ---

function renderizarComponentesDisponibles() {
    const container = document.getElementById('componentes-disponibles');
    if (!container) return;

    container.innerHTML = '<h4><i class="fas fa-puzzle-piece"></i> Componentes Disponibles</h4>';

    // Controles Generales (Viajeros, Fecha, Duración)
    const controlesViajeHTML = `
        <div class=\"controles-viaje mb-3 p-3 bg-light border rounded\">
            <h5><i class=\"fas fa-users\"></i> Detalles del Viaje</h5>
            <div class=\"form-row\">
                <div class=\"form-group col-md-4\">
                    <label for=\"numero-viajeros-flexible\">Viajeros:</label>
                    <input type=\"number\" id=\"numero-viajeros-flexible\" class=\"form-control form-control-sm\" value=\"${planActual.numeroViajeros}\" min=\"1\">
                </div>
                <div class=\"form-group col-md-4\">
                    <label for=\"duracion-dias-flexible\">Días:</label>
                    <input type=\"number\" id=\"duracion-dias-flexible\" class=\"form-control form-control-sm\" value=\"${planActual.duracionDias}\" min=\"1\">
                </div>
                <div class=\"form-group col-md-4\">
                     <label for=\"fecha-viaje-flexible\">Fecha Inicio:</label>
                     <input type=\"date\" id=\"fecha-viaje-flexible\" class=\"form-control form-control-sm\" value=\"${planActual.fechaViaje || ''}\" min=\"${new Date().toISOString().split('T')[0]}\">
                 </div>
            </div>
        </div>
        <hr>
    `;
    container.innerHTML += controlesViajeHTML;

    // Escuchar cambios en los controles generales
    document.getElementById('numero-viajeros-flexible')?.addEventListener('change', (e) => {
        planActual.numeroViajeros = parseInt(e.target.value) || 1;
        calcularCostoTotalFlexible();
    });
     document.getElementById('duracion-dias-flexible')?.addEventListener('change', (e) => {
        planActual.duracionDias = parseInt(e.target.value) || 1;
        calcularCostoTotalFlexible(); // Duración afecta costo de servicios por día
    });
    document.getElementById('fecha-viaje-flexible')?.addEventListener('change', (e) => {
        planActual.fechaViaje = e.target.value || null;
    });

    // Renderizar Categorías y Componentes
    for (const categoriaNombre in componentesDisponibles) {
        const categoriaDiv = document.createElement('div');
        categoriaDiv.className = 'categoria-componente card mb-3'; // Usar card para mejor estructura

        const tituloCategoria = document.createElement('div');
        tituloCategoria.className = 'card-header bg-light';
        // Iconos representativos por categoría (ejemplo)
        let icono = 'fa-puzzle-piece';
        if (categoriaNombre === 'destinos') icono = 'fa-map-marker-alt';
        else if (categoriaNombre === 'transporte') icono = 'fa-car';
        else if (categoriaNombre === 'hospedaje') icono = 'fa-bed';
        else if (categoriaNombre === 'alimentacion') icono = 'fa-utensils';
        else if (categoriaNombre === 'guias') icono = 'fa-user-tie';
        else if (categoriaNombre === 'extras') icono = 'fa-star';

        tituloCategoria.innerHTML = `<h5><i class="fas ${icono} mr-2"></i>${categoriaNombre.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h5>`;
        categoriaDiv.appendChild(tituloCategoria);

        const cardBody = document.createElement('div');
        cardBody.className = 'list-group list-group-flush'; // Usar list-group

        componentesDisponibles[categoriaNombre].forEach(componente => {
            const itemButton = document.createElement('button'); // Cambiar a button para mejor semántica y accesibilidad
            itemButton.type = 'button';
            itemButton.className = 'list-group-item list-group-item-action componente-item d-flex justify-content-between align-items-center';
            itemButton.dataset.id = componente.id;

            // Determinar si el componente está actualmente seleccionado
             const isSelected = planActual.componentes.includes(componente.id);
             if (isSelected) {
                itemButton.classList.add('active'); // Marcar visualmente si está seleccionado
             }


            itemButton.innerHTML = `
                <div class=\"componente-info flex-grow-1 mr-3\">
                    <span class=\"font-weight-bold\">${componente.nombre}</span>
                    ${componente.descripcion ? `<small class=\"d-block text-muted\">${componente.descripcion}</small>` : ''}
                    <small class=\"d-block text-primary\">$${formatearPrecio(componente.precio)} ${componente.categoria !== 'Destino' && componente.categoria !== 'Extra' ? '/ día' : componente.categoria === 'Extra' ? '(único)' : '/ entrada'}</small>
                </div>
                <i class=\"fas ${isSelected ? 'fa-check-circle text-success' : 'fa-plus-circle text-primary'} btn-anadir-quitar\"></i>
            `;

             // Listener para añadir/quitar
            itemButton.addEventListener('click', () => {
                if (planActual.componentes.includes(componente.id)) {
                    quitarComponenteDelPlan(componente.id);
                } else {
                    agregarComponenteAlPlan(componente.id);
                }
                 // Actualizar visualmente el botón después de la acción
                renderizarComponentesDisponibles(); // Re-renderizar para actualizar estado visual
                renderizarPlanSeleccionado();
            });

            cardBody.appendChild(itemButton);
        });

        categoriaDiv.appendChild(cardBody);
        container.appendChild(categoriaDiv);
    }
}


function renderizarPlanSeleccionado() {
    const listaContainer = document.getElementById('lista-plan-seleccionado');
    const costoTotalElement = document.getElementById('costo-total-flexible');
    if (!listaContainer || !costoTotalElement) return;

    listaContainer.innerHTML = ''; // Limpiar lista

    if (planActual.componentes.length === 0) {
        listaContainer.innerHTML = '<p class=\"text-muted text-center\">Añade componentes desde la izquierda.</p>';
    } else {
        // Agrupar por categoría para mejor visualización
        const planAgrupado = {};
        planActual.componentes.forEach(id => {
            const comp = encontrarComponente(id);
            if (comp) {
                if (!planAgrupado[comp.categoria]) {
                    planAgrupado[comp.categoria] = [];
                }
                planAgrupado[comp.categoria].push(comp);
            }
        });

         for (const categoria in planAgrupado) {
             const categoriaDiv = document.createElement('div');
             categoriaDiv.className = 'mb-2';
             const tituloCat = document.createElement('strong');
             tituloCat.textContent = categoria + ':';
             categoriaDiv.appendChild(tituloCat);
             const listaUl = document.createElement('ul');
             listaUl.className = 'list-unstyled pl-3';

             planAgrupado[categoria].forEach(comp => {
                 const itemLi = document.createElement('li');
                 itemLi.className = 'd-flex justify-content-between align-items-center componente-seleccionado-item';
                 itemLi.innerHTML = `
                     <small>${comp.nombre} ($${formatearPrecio(comp.precio)})</small>
                     <button class="btn-quitar btn btn-sm btn-outline-danger border-0" data-id="${comp.id}" title="Quitar">&times;</button>
                 `;
                 listaUl.appendChild(itemLi);
             });
             categoriaDiv.appendChild(listaUl);
             listaContainer.appendChild(categoriaDiv);
         }


        // Añadir listeners a los botones "Quitar"
        listaContainer.querySelectorAll('.btn-quitar').forEach(button => {
            button.addEventListener('click', () => {
                quitarComponenteDelPlan(button.dataset.id);
                renderizarComponentesDisponibles(); // Actualizar botones de añadir/quitar
                renderizarPlanSeleccionado(); // <<-- AÑADIR ESTA LÍNEA para actualizar la lista visual
            });
        });
    }

    // Actualizar costo total (se llama desde calcularCostoTotalFlexible)
    calcularCostoTotalFlexible();
     // Actualizar texto del botón PDF para reflejar el costo
     const btnPdf = document.querySelector('.acciones-plan .btn-descargar');
     if (btnPdf) {
         btnPdf.innerHTML = `<i class=\"fas fa-download\"></i> Descargar Resumen ($${formatearPrecio(costoTotalActual)})`;
     }
}

// --- Lógica de Manipulación del Plan ---

function agregarComponenteAlPlan(id) {
    const componente = encontrarComponente(id);
    if (!componente) return;

    const categoriaComponente = componente.categoria;
    const esExclusivo = ['Transporte', 'Hospedaje', 'Alimentación', 'Guía'].includes(categoriaComponente);

    if (esExclusivo) {
        // Remover cualquier otro componente de la misma categoría
        planActual.componentes = planActual.componentes.filter(itemId => {
            const compExistente = encontrarComponente(itemId);
            return !compExistente || compExistente.categoria !== categoriaComponente;
        });
    }

     // Añadir el nuevo componente si no es una opción \"ninguno\" o si no estaba ya
    if (componente.precio >= 0 && !planActual.componentes.includes(id)) { // Permitir añadir los de precio 0 (ej. Sin Guía)
         planActual.componentes.push(id);
    }

    // No es necesario llamar a renderizarPlanSeleccionado aquí, se llamará desde la función que lo invoca (listener)
}

function quitarComponenteDelPlan(id) {
    planActual.componentes = planActual.componentes.filter(itemId => itemId !== id);
    // No es necesario llamar a renderizarPlanSeleccionado aquí, se llamará desde la función que lo invoca (listener)
}

// --- Cálculo de Costo ---

function calcularCostoTotalFlexible() {
    costoTotalActual = 0;
    let costoPorDia = 0;
    let costoUnico = 0;

    planActual.componentes.forEach(id => {
        const componente = encontrarComponente(id);
        if (componente) {
            // Categorías con costo por día vs costo único
            if (['Transporte', 'Hospedaje', 'Alimentación', 'Guía'].includes(componente.categoria)) {
                costoPorDia += componente.precio;
            } else { // Destinos y Extras tienen costo único por persona (o por entrada/servicio)
                costoUnico += componente.precio;
            }
        }
    });

    // Calcular costo total: (Costo único * viajeros) + (Costo por día * viajeros * días)
     // Asegurarse de que la duración sea al menos 1
     const duracionEfectiva = Math.max(1, planActual.duracionDias);
     // Para hospedaje, el costo es por noche, así que restamos 1 día si la duración es > 0
     const nochesHospedaje = duracionEfectiva;

     let costoTotalHospedaje = 0;
     let costoTotalOtrosPorDia = 0;

     planActual.componentes.forEach(id => {
        const comp = encontrarComponente(id);
        if (comp) {
            if (comp.categoria === 'Hospedaje') {
                costoTotalHospedaje += comp.precio;
            } else if (['Transporte', 'Alimentación', 'Guía'].includes(comp.categoria)) {
                 costoTotalOtrosPorDia += comp.precio;
             }
         }
     });


    costoTotalActual = (costoUnico * planActual.numeroViajeros) +
                         (costoTotalOtrosPorDia * planActual.numeroViajeros * duracionEfectiva) +
                         (costoTotalHospedaje * planActual.numeroViajeros * nochesHospedaje);


    const costoTotalElement = document.getElementById('costo-total-flexible');
    if (costoTotalElement) {
        costoTotalElement.textContent = formatearPrecio(costoTotalActual);
    }
}


// --- Generación de Itinerario (Mejorado Visualmente) ---
function generarItinerarioFlexible() {
    const container = document.getElementById('itinerario-flexible-contenido');
    const containerWrapper = document.getElementById('itinerario-flexible-container');
    if (!container || !containerWrapper) return;

    container.innerHTML = ''; // Limpiar

    if (planActual.componentes.length === 0) {
        container.innerHTML = '<p class=\"text-muted text-center\">No has seleccionado ningún componente para generar un itinerario.</p>';
        containerWrapper.style.display = 'block';
        return;
    }
    
    // Agrupar componentes por categoría
    const planAgrupado = {};
    planActual.componentes.forEach(id => {
        const comp = encontrarComponente(id);
        if (comp) {
            if (!planAgrupado[comp.categoria]) {
                planAgrupado[comp.categoria] = [];
            }
            planAgrupado[comp.categoria].push(comp);
        }
    });

    // Generar HTML con mejor estructura
    let resumenHTML = '<div class=\"resumen-itinerario-mejorado\">';
    
    // Sección Detalles Generales
    resumenHTML += '<div class=\"detalle-general-itinerario mb-4 p-3 bg-light border rounded\"><h5><i class=\"fas fa-info-circle mr-2\"></i>Detalles Generales</h5>';
    resumenHTML += `<p><strong><i class=\"fas fa-users mr-1\"></i> Viajeros:</strong> ${planActual.numeroViajeros}</p>`;
    resumenHTML += `<p><strong><i class=\"fas fa-calendar-alt mr-1\"></i> Duración:</strong> ${planActual.duracionDias} día(s)</p>`;
    if (planActual.fechaViaje) {
        const fechaFormateada = new Date(planActual.fechaViaje + 'T00:00:00').toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
        resumenHTML += `<p><strong><i class=\"fas fa-calendar-check mr-1\"></i> Fecha Inicio:</strong> ${fechaFormateada}</p>`;
    }
    resumenHTML += '</div>';

    // Sección Componentes por Categoría
    resumenHTML += '<h5><i class=\"fas fa-clipboard-list mr-2\"></i>Componentes Seleccionados</h5>';
    for (const categoria in planAgrupado) {
        resumenHTML += `<div class=\"categoria-itinerario card mb-3\"><div class=\"card-header bg-light\"><strong>${categoria}</strong></div><ul class=\"list-group list-group-flush\">`;
        planAgrupado[categoria].forEach(comp => {
            resumenHTML += `<li class=\"list-group-item\">`;
            resumenHTML += `<span class=\"nombre-componente\">${comp.nombre}</span>`;
            if (comp.descripcion) {
                resumenHTML += `<small class=\"d-block text-muted\">${comp.descripcion}</small>`;
            }
            resumenHTML += `<span class=\"precio-componente float-right\">$${formatearPrecio(comp.precio)}</span>`;
            resumenHTML += `</li>`;
        });
        resumenHTML += '</ul></div>';
    }

    // Sección Costo Total
    resumenHTML += `<div class=\"costo-total-itinerario mt-4 pt-3 border-top text-right\">`;
    resumenHTML += `<p class=\"h4 text-primary\"><strong>Costo Total Estimado:</strong> $${formatearPrecio(costoTotalActual)} COP</p>`;
    resumenHTML += `</div>`;

    resumenHTML += '</div>'; // Cierre de resumen-itinerario-mejorado

    container.innerHTML = resumenHTML;
    containerWrapper.style.display = 'block';
    containerWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


// --- Simulación de Pago (Adaptada) ---
function simularPagoFlexible() {
     if (planActual.componentes.length === 0) {
        alert("Por favor, añade al menos un componente a tu plan antes de proceder al pago.");
        return;
    }
    const modalPago = document.createElement('div');
    modalPago.className = 'modal-pago';
    modalPago.style.display = 'flex'; // Asegurar visibilidad si se reutiliza CSS
    modalPago.innerHTML = `
        <div class=\"modal-contenido\">
            <h3>Pasarela de pagos</h3>
            <p>Monto a pagar: $<span>${formatearPrecio(costoTotalActual)}</span> COP</p>
            <div class=\"opciones-pago\">
                 <button onclick=\"procesarPagoFlexible('tarjeta')\" class=\"btn-opcion-pago btn btn-primary\"><i class=\"fas fa-credit-card\"></i> Tarjeta</button>
                 <button onclick=\"procesarPagoFlexible('transferencia')\" class=\"btn-opcion-pago btn btn-primary\"><i class=\"fas fa-university\"></i> Transferencia</button>
                 <button onclick=\"procesarPagoFlexible('pse')\" class=\"btn-opcion-pago btn btn-primary\"><i class=\"fas fa-money-check\"></i> PSE</button>
            </div>
            <div class=\"resumen-pago mt-3\">
                <strong>Resumen:</strong>
                <ul>${planActual.componentes.map(id => `<li><small>${encontrarComponente(id)?.nombre || '?'}</small></li>`).join('')}</ul>
                <small>Viajeros: ${planActual.numeroViajeros} | Días: ${planActual.duracionDias} ${planActual.fechaViaje ? '| Fecha: ' + new Date(planActual.fechaViaje).toLocaleDateString('es-ES') : ''}</small>
            </div>
            <button class=\"btn-cancelar mt-4\" onclick=\"cerrarModalPago()\">Cancelar</button>
        </div>
    `;
    document.body.appendChild(modalPago);
    
     // Añadir estilos si no existen (importante si se eliminó el CSS viejo)
     if (!document.getElementById('estilos-modal-pago')) {
    const estiloModal = document.createElement('style');
         estiloModal.id = 'estilos-modal-pago';
    estiloModal.textContent = `
            .modal-pago { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 1050; }
            .modal-contenido { 
                background-color: white; 
                padding: 35px; 
                border-radius: var(--radius); 
                max-width: 550px; 
                width: 92%; 
                text-align: center; 
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
            }
            .modal-contenido h3 { 
                color: var(--color-primary); 
                margin-bottom: 20px; 
                padding-bottom: 12px; 
                border-bottom: 2px solid var(--color-accent);
                font-size: 1.6rem;
            }
            .opciones-pago { display: flex; justify-content: center; gap: 15px; margin: 25px 0; flex-wrap: wrap; }
            .btn-opcion-pago { 
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                justify-content: center;
                gap: 10px; 
                flex: 1; 
                min-width: 120px; 
                min-height: 100px;
                padding: 15px 10px;
                font-size: 1.1rem;
                font-weight: 500;
                border-radius: 8px;
                transition: all 0.2s ease;
            }
            .btn-opcion-pago:hover { 
                transform: translateY(-3px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
            .btn-opcion-pago i { font-size: 2rem; margin-bottom: 8px; }
            .btn-cancelar {
                padding: 12px 25px;
                background-color: #6c757d;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 1.1rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                min-width: 160px;
            }
            .btn-cancelar:hover {
                background-color: #5a6268;
                transform: translateY(-2px);
                box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
            }
            .resumen-pago { background-color: #f9f9f9; padding: 10px; border-radius: var(--radius); text-align: left; font-size: 0.9rem; border-left: 3px solid var(--color-primary); }
            .resumen-pago ul { padding-left: 15px; margin-bottom: 5px; }
            .loader { border: 5px solid #f3f3f3; border-top: 5px solid var(--color-primary); border-radius: 50%; width: 40px; height: 40px; animation: spin 1.5s linear infinite; margin: 20px auto; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            .confirmacion-pago i { font-size: 3rem; color: #28a745; margin-bottom: 10px; }
            .detalles-reserva { background-color: #f9f9f9; padding: 15px; border-radius: var(--radius); margin-bottom: 15px; text-align: left; font-size: 0.9rem;}
            .detalles-reserva p { margin: 5px 0; }
            .codigo-reserva { font-weight: bold; color: var(--color-primary); }
            .acciones-confirmacion { display: flex; justify-content: center; gap: 10px; margin-top: 15px; flex-wrap: wrap; }
            .btn-accion { background-color: var(--color-primary); color: white; }
        `;
        document.head.appendChild(estiloModal);
     }
}

function cerrarModalPago() {
    const modalPago = document.querySelector('.modal-pago');
    if (modalPago) {
        modalPago.remove();
    }
}

function obtenerTextoMetodoPago(metodo) {
    switch (metodo) {
        case 'tarjeta': return 'Tarjeta';
        case 'transferencia': return 'Transferencia';
        case 'pse': return 'PSE';
        default: return 'Desconocido';
    }
}

function procesarPagoFlexible(metodo) {
    const modalContenido = document.querySelector('.modal-pago .modal-contenido');
    if (!modalContenido) return;

    modalContenido.innerHTML = `<h3>Procesando pago...</h3><div class="loader"></div>`;

    setTimeout(function() {
        const codigoReserva = `MCF-${Math.floor(Math.random() * 100000)}`;
        const componentesNombres = planActual.componentes.map(id => encontrarComponente(id)?.nombre || '?').join(', ') || 'Ninguno'; // Manejar caso vacío
        
        modalContenido.innerHTML = `
            <h3>¡Pago Exitoso!</h3>
            <div class="confirmacion-pago"><i class="fas fa-check-circle"></i><p>Reserva confirmada</p></div>
            <div class="detalles-reserva">
                 <p><strong>Componentes:</strong> ${componentesNombres}</p>
                 <p><strong>Viajeros:</strong> ${planActual.numeroViajeros} | <strong>Días:</strong> ${planActual.duracionDias}</p>
                 ${planActual.fechaViaje ? `<p><strong>Fecha:</strong> ${new Date(planActual.fechaViaje).toLocaleDateString('es-ES')}</p>` : ''}
                 <p><strong>Monto:</strong> $${formatearPrecio(costoTotalActual)} COP | <strong>Método:</strong> ${obtenerTextoMetodoPago(metodo)}</p>
                 <p><strong>Código Reserva:</strong> <span class="codigo-reserva">${codigoReserva}</span></p>
            </div>
            <p><small>Hemos enviado el resumen a tu correo electrónico (simulado).</small></p>
            <div class="acciones-confirmacion">
                <button class="btn btn-sm btn-accion" onclick="descargarItinerario()"><i class="fas fa-download"></i> Descargar Resumen</button>
                <button class="btn btn-sm btn-secondary" onclick="cerrarModalPago()"><i class="fas fa-times"></i> Cerrar</button>
            </div>
        `;
    }, 2500); // Reducido tiempo de simulación
}

// --- Generación de PDF (Adaptada) ---
function descargarItinerario() { // Ahora genera un Resumen del Plan
    if (planActual.componentes.length === 0) {
        mostrarNotificacion('No hay componentes seleccionados para generar un resumen.', 'info'); // Cambiado a info
        return;
    }

    if (typeof window.jspdf === 'undefined') {
        console.error('Error: La librería jsPDF no está cargada.');
        mostrarNotificacion('Error al generar PDF: La librería no está cargada.', 'error');
        return;
    }

    try { // Envolver en try...catch
        const { jsPDF } = window.jspdf;
        // Verificar que jsPDF sea una función constructora
        if (typeof jsPDF !== 'function') {
            throw new Error('jsPDF no es una función constructora.');
        }
        const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

        let y = 15; // Margen superior
        const pageHeight = doc.internal.pageSize.height;
        const margin = 15;
        const lineHeight = 6; 
        const sectionSpacing = 8;

        function checkPageBreak(increment) {
            if (y + increment > pageHeight - margin) { 
                doc.addPage();
                y = margin; 
            }
        }

        // Título
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('Resumen de Plan - Magia Cafetera', margin, y);
        y += sectionSpacing;
        doc.setLineWidth(0.3);
        doc.line(margin, y, doc.internal.pageSize.width - margin, y);
        y += sectionSpacing;

        // Detalles Generales
        checkPageBreak(lineHeight * 3);
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text('Detalles Generales:', margin, y); y += lineHeight * 1.2;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Número de Viajeros: ${planActual.numeroViajeros}`, margin, y); y += lineHeight;
        doc.text(`Duración: ${planActual.duracionDias} día(s)`, margin, y); y += lineHeight;
         if (planActual.fechaViaje) {
             checkPageBreak(lineHeight);
             // Formatear fecha de manera segura
             const fechaFormateada = new Date(planActual.fechaViaje + 'T00:00:00').toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
             doc.text(`Fecha de Viaje: ${fechaFormateada}`, margin, y); y += lineHeight;
         }
         y += sectionSpacing * 0.5;

        // Componentes Seleccionados
        checkPageBreak(lineHeight * 2);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('COMPONENTES SELECCIONADOS:', margin, y);
        y += lineHeight * 1.5;
        doc.setFontSize(9); 
        doc.setFont(undefined, 'normal');

        const planAgrupadoPDF = {};
         planActual.componentes.forEach(id => {
             const comp = encontrarComponente(id);
             if (comp) {
                 if (!planAgrupadoPDF[comp.categoria]) {
                     planAgrupadoPDF[comp.categoria] = [];
                 }
                 planAgrupadoPDF[comp.categoria].push(comp);
             }
         });

         for (const categoria in planAgrupadoPDF) {
            checkPageBreak(lineHeight * 1.5);
            doc.setFont(undefined, 'bold');
            doc.text(categoria + ':', margin, y);
            y += lineHeight * 0.8;
            doc.setFont(undefined, 'normal');

            planAgrupadoPDF[categoria].forEach(comp => {
                checkPageBreak(lineHeight);
                let textoComp = `- ${comp.nombre}`;
                if (comp.descripcion) textoComp += ` (${comp.descripcion})`;
                textoComp += ` - $${formatearPrecio(comp.precio)}`;
                 if (['Transporte', 'Alimentación', 'Guía'].includes(comp.categoria)) {
                     textoComp += ' / día';
                 } else if (comp.categoria === 'Hospedaje') {
                     textoComp += ' / noche';
                 } else if (comp.categoria === 'Extra') {
                     textoComp += ' (pago único)';
                 }

                const splitText = doc.splitTextToSize(textoComp, doc.internal.pageSize.width - margin * 2 - 5); 
                doc.text(splitText, margin + 5, y);
                y += splitText.length * (lineHeight * 0.8); 
            });
            y += lineHeight * 0.5; 
         }
         y += sectionSpacing;

        // Costo Total
        checkPageBreak(lineHeight * 2);
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text(`COSTO TOTAL ESTIMADO: $${formatearPrecio(costoTotalActual)} COP`, margin, y);
         doc.setFontSize(9);
         doc.setFont(undefined, 'normal');
         doc.text(`(para ${planActual.numeroViajeros} viajero(s) durante ${planActual.duracionDias} día(s))`, margin, y + lineHeight * 0.8);
        y += sectionSpacing * 1.5;

        // Pie de página
        checkPageBreak(lineHeight * 4);
        doc.setLineWidth(0.3);
        doc.line(margin, y, doc.internal.pageSize.width - margin, y);
        y += lineHeight * 1.5;
        doc.setFontSize(8);
        doc.setFont(undefined, 'italic');
        doc.text('Este es un resumen del plan seleccionado. Los precios son estimados y pueden variar.', margin, y); y += lineHeight * 0.8;
        doc.text('¡Gracias por elegir Magia Cafetera!', margin, y); y += lineHeight * 0.8;
        doc.text('Contacto: magiacafetera17@gmail.com | WhatsApp: +57 310 694 7318', margin, y);

        // Guardar PDF
        doc.save('Resumen_Plan_Magia_Cafetera.pdf');
        mostrarNotificacion('Resumen PDF generado con éxito.', 'success');

    } catch (error) {
        console.error("Error detallado al generar PDF:", error);
        mostrarNotificacion('Hubo un error al generar el PDF. Revisa la consola para detalles.', 'error');
    }
}


// --- Inicialización ---
document.addEventListener('DOMContentLoaded', function() {
    // Renderizar el nuevo planificador
    renderizarComponentesDisponibles();
    renderizarPlanSeleccionado(); // Renderizar el plan (inicialmente vacío)

    // Comprobar si hay un destino pendiente de la selección inicial
     const destinoPendiente = sessionStorage.getItem('destinoInicialPendiente');
     if (destinoPendiente) {
         agregarComponenteAlPlan(destinoPendiente);
         renderizarComponentesDisponibles(); // Re-renderizar para marcarlo
         renderizarPlanSeleccionado();
         sessionStorage.removeItem('destinoInicialPendiente'); // Limpiar
         mostrarNotificacion(`${encontrarComponente(destinoPendiente)?.nombre} añadido al plan.`, 'success');
     }

    // --- Manejo del formulario de contacto ---
    const formContacto = document.getElementById('form-contacto');
    if (formContacto) {
        formContacto.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevenir envío real del formulario
            // Simulación de envío exitoso
            mostrarNotificacion('Mensaje enviado con éxito. ¡Gracias por contactarnos!', 'success');
            // Opcional: Limpiar el formulario después del envío
            formContacto.reset();
        });
    }

    // --- Configuración Filtros Destinos (SE MANTIENE) ---
    const filterControls = document.querySelectorAll('.sidebar .filtro select, .sidebar .filtro input[type=\"checkbox\"]');
    const resetButton = document.getElementById('reset-filtros');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const mainSidebarContainer = document.querySelector('.sidebar'); // Puede ser null si se eliminó el sidebar

    if (filterControls.length > 0 && mainSidebarContainer) { // Verificar que existan los controles y el sidebar
        filterControls.forEach(control => {
            control.addEventListener('change', filtrarDestinos);
        });

        if (resetButton) {
            resetButton.addEventListener('click', limpiarFiltros);
        }

        if (sidebarToggle) {
             // Lógica para colapsar/expandir sidebar en móvil
             const sidebarContent = mainSidebarContainer.querySelector('.filtros-destinos'); // El contenido real a mostrar/ocultar
             if (window.innerWidth < 768 && sidebarContent) { // Oculto por defecto en móvil
                 mainSidebarContainer.classList.remove('active');
                 sidebarToggle.classList.remove('active');
                 sidebarContent.style.display = 'none'; // Ocultar explícitamente
             } else if (sidebarContent) { // Visible por defecto en desktop
                 mainSidebarContainer.classList.add('active');
                  sidebarToggle.classList.add('active');
                  sidebarContent.style.display = 'block'; // Mostrar explícitamente
             }


            sidebarToggle.addEventListener('click', () => {
                mainSidebarContainer.classList.toggle('active');
                sidebarToggle.classList.toggle('active');
                 if (sidebarContent) { // Mostrar/ocultar contenido
                    sidebarContent.style.display = mainSidebarContainer.classList.contains('active') ? 'block' : 'none';
                 }
            });
        }
        filtrarDestinos(); // Filtrar al cargar si existen filtros
    } else {
        console.log("Controles de filtro o sidebar no encontrados. Se omite configuración de filtros.");
    }
     // --- Fin Configuración Filtros Destinos ---

    // --- Lógica para Animaciones Fade-in ---
    const fadeElems = document.querySelectorAll('.fade-in');
    const observerOptions = {
        root: null, // Observa intersecciones relativas al viewport
        rootMargin: '0px',
        threshold: 0.1 // Se activa cuando al menos 10% del elemento es visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Deja de observar una vez que es visible
            }
        });
    };

    const fadeInObserver = new IntersectionObserver(observerCallback, observerOptions);

    fadeElems.forEach(elem => {
        fadeInObserver.observe(elem);
    });

});


// --- Lógica Filtros Destinos (SE MANTIENE) ---
function filtrarDestinos() {
     // Verificar si los elementos existen antes de acceder a sus propiedades
     const filterTypeEl = document.getElementById('filter-type');
     const filterLocationEl = document.getElementById('filter-location');
     const filterPriceEl = document.getElementById('filter-price');
     const filterDurationEl = document.getElementById('filter-duration');
     const filterAccessibilityEl = document.getElementById('filter-accessibility');
     const mensajeNoResultados = document.getElementById('mensaje-no-resultados');
     const listaDestinosContainer = document.querySelector('.lista-destinos');

     // Si no existe el contenedor de destinos, no hacer nada
     if (!listaDestinosContainer) return;

     const filterType = filterTypeEl ? filterTypeEl.value : '';
     const filterLocation = filterLocationEl ? filterLocationEl.value : '';
     const filterPrice = filterPriceEl ? filterPriceEl.value : '';
     const filterDuration = filterDurationEl ? filterDurationEl.value : '';
     const filterAccessibility = filterAccessibilityEl ? filterAccessibilityEl.checked : false;

    
    const selectedActivities = [];
     // Asegurarse que el contenedor de filtros exista
     const sidebarFiltros = document.querySelector('.sidebar .filtros-destinos');
     if (sidebarFiltros) {
         sidebarFiltros.querySelectorAll('input[type=\"checkbox\"][id^=\"filter-activity-\"]:checked').forEach(checkbox => {
        selectedActivities.push(checkbox.id.replace('filter-activity-', ''));
    });
     }


    const destinos = listaDestinosContainer.querySelectorAll('.destino');
    let resultadosVisibles = 0;

    destinos.forEach(destino => {
        const tipo = destino.dataset.type || '';
        const ubicacion = destino.dataset.location || '';
        const precio = destino.dataset.price || '';
        const duracion = destino.dataset.duration || '';
        const accesibilidad = destino.dataset.accessibility === 'true';
        const actividadesDestino = (destino.dataset.activities || '').split(',');

        let mostrar = true;

        if (filterType && tipo !== filterType) mostrar = false;
        if (filterLocation && !ubicacion.includes(filterLocation)) mostrar = false;
        if (filterPrice && precio !== filterPrice) mostrar = false;
        if (filterDuration && duracion !== filterDuration) mostrar = false;
        if (filterAccessibility && !accesibilidad) mostrar = false;

        if (mostrar && selectedActivities.length > 0) {
            const todasPresentes = selectedActivities.every(actividadSel => actividadesDestino.includes(actividadSel));
            if (!todasPresentes) mostrar = false;
        }

        destino.style.display = mostrar ? 'block' : 'none';
        if (mostrar) resultadosVisibles++;
    });

    if (mensajeNoResultados) {
        mensajeNoResultados.style.display = resultadosVisibles === 0 ? 'block' : 'none';
    }
}

function limpiarFiltros() {
     const sidebarFiltros = document.querySelector('.sidebar .filtros-destinos');
     if (!sidebarFiltros) return; // Salir si no hay filtros

    sidebarFiltros.querySelectorAll('select').forEach(select => {
        select.selectedIndex = 0;
    });
    sidebarFiltros.querySelectorAll('input[type=\"checkbox\"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    filtrarDestinos(); // Reaplicar filtros (ahora limpios)
}


// --- Funciones reutilizadas o mantenidas ---
function mostrarNotificacion(mensaje, tipo = 'success') {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.innerHTML = `
        <div class=\"notificacion-contenido\">
            <i class=\"fas ${tipo === 'success' ? 'fa-check-circle' : tipo === 'error' ? 'fa-times-circle' : 'fa-info-circle'}\"></i>
            <p>${mensaje}</p>
        </div>
    `;
    // Reutilizar estilos si ya existen
    if (!document.getElementById('estilos-notificacion')) {
        const estilos = document.createElement('style');
        estilos.id = 'estilos-notificacion';
        estilos.textContent = `
            .notificacion { position: fixed; top: 20px; right: 20px; padding: 12px 18px; background-color: #fff; border-left: 5px solid #ccc; border-radius: 4px; box-shadow: 0 3px 10px rgba(0,0,0,0.15); z-index: 1060; animation: slideInRight 0.4s ease, fadeOut 0.5s ease 3.5s forwards; max-width: 350px; font-size: 0.95rem; }
            .notificacion-contenido { display: flex; align-items: center; gap: 10px; }
            .notificacion i { font-size: 1.2rem; } .notificacion p { margin: 0; }
            .notificacion-success { border-left-color: #28a745; } .notificacion-success i { color: #28a745; }
            .notificacion-error { border-left-color: #dc3545; } .notificacion-error i { color: #dc3545; }
            .notificacion-info { border-left-color: #17a2b8; } .notificacion-info i { color: #17a2b8; }
            @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            @keyframes fadeOut { 90% { opacity: 1; } 100% { opacity: 0; visibility: hidden; } }
        `;
        document.head.appendChild(estilos);
    }
    document.body.appendChild(notificacion);
    setTimeout(() => { notificacion.remove(); }, 4000); // 4 segundos visible
}

// Adaptada para añadir al nuevo planificador
function seleccionarDestinoYRedireccionar(destinoIdCompleto) {
    const componente = encontrarComponente(destinoIdCompleto);

    if (componente && componente.categoria === 'Destino') {
         // Limpiar otros destinos si la lógica es que solo se puede empezar con uno
         planActual.componentes = planActual.componentes.filter(id => {
             const compExistente = encontrarComponente(id);
             return !compExistente || compExistente.categoria !== 'Destino';
         });
         agregarComponenteAlPlan(destinoIdCompleto); // Añade el destino al plan
         renderizarComponentesDisponibles(); // Actualiza visualmente la lista de disponibles
         renderizarPlanSeleccionado(); // Actualiza el plan seleccionado
         mostrarNotificacion(`Has añadido ${componente.nombre} a tu plan. Continúa personalizando.`, 'success');

        window.location.hash = '#planificador';
        const planificadorSection = document.getElementById('planificador');
        if (planificadorSection) {
            planificadorSection.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        console.error(`No se encontró el componente de destino con ID: ${destinoIdCompleto} o no es un destino.`);
        mostrarNotificacion(`Error al seleccionar el destino. Inténtalo de nuevo.`, 'error');
    }
}


// --- FIN DE LA NUEVA LÓGICA ---