
// CONFIGURACIÓN INICIAL

const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
document.getElementById('fecha-actual').textContent = new Date().toLocaleDateString('es-ES', opcionesFecha);

const API_URL = 'http://localhost:5224/tasks';
let idEdicion = null;

const inputFecha = document.getElementById('input-fecha');
if (inputFecha) {
    const hoy = new Date().toISOString().split('T')[0];
    inputFecha.setAttribute('min', hoy);
}


// 1. CARGAR DASHBOARD

async function cargarDashboard(filtro = 'todas') {
    try {
        let urlFinal = API_URL;
        if (filtro === 'pendientes') urlFinal += '?status=pending';
        if (filtro === 'completadas') urlFinal += '?status=completed';

        const respuesta = await fetch(urlFinal);
        const tareasAMostrar = await respuesta.json();

        const resTotal = await fetch(API_URL);
        const todas = await resTotal.json();
        
        actualizarEstadisticas(todas);
        dibujarLista(tareasAMostrar);

    } catch (error) {
        console.error("Error conectando a la API:", error);
        document.getElementById('task-container').innerHTML = `
            <div class="p-5 text-center text-danger">
                <i class="bi bi-exclamation-triangle fs-1"></i>
                <p class="mt-2">Error de conexión con el servidor C#. Asegúrate de que esté corriendo.</p>
            </div>`;
    }
}


// 2. ACTUALIZAR ESTADÍSTICAS

function actualizarEstadisticas(tareas) {
    const total = tareas.length;
    const completadas = tareas.filter(t => t.taskStatus).length;
    const pendientes = total - completadas;
    const progreso = total === 0 ? 0 : Math.round((completadas / total) * 100);

    document.getElementById('stat-total').innerText = total;
    document.getElementById('stat-completadas').innerText = completadas;
    document.getElementById('stat-pendientes').innerText = pendientes;
    document.getElementById('stat-progreso').innerText = progreso + '%';
}


// 3. DIBUJAR LA LISTA DE TAREAS

function dibujarLista(tareas) {
    const contenedor = document.getElementById('task-container');
    contenedor.innerHTML = '';

    if (tareas.length === 0) {
        contenedor.innerHTML = '<div class="p-5 text-center text-muted"><i class="bi bi-inbox fs-1"></i><p class="mt-2">No hay tareas en esta sección.</p></div>';
        return;
    }

  
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    tareas.forEach(tarea => {
        const fecha = new Date(tarea.dueDate).toLocaleDateString('es-ES');
        const tachado = tarea.taskStatus ? 'text-decoration-line-through text-muted' : '';
        const marcado = tarea.taskStatus ? 'checked disabled' : '';

       
        const fechaLimite = new Date(tarea.dueDate);
        fechaLimite.setHours(0, 0, 0, 0); 
        
       
        const estaVencida = fechaLimite < hoy && !tarea.taskStatus;
        
     
        const colorTexto = estaVencida ? 'text-danger fw-bold' : 'text-muted';
        const badgeVencida = estaVencida ? '<span class="badge bg-danger ms-2">¡Vencida!</span>' : '';
      

        contenedor.innerHTML += `
            <div class="d-flex align-items-center justify-content-between border-bottom p-3" style="transition: 0.2s;">
                <div class="d-flex align-items-center gap-3">
                    <div class="form-check form-switch fs-4 m-0">
                        <input class="form-check-input" type="checkbox" role="switch" ${marcado} onchange="completarTarea(event, ${tarea.id})">
                    </div>
                    <div>
                        <h6 class="mb-0 fw-bold ${tachado}">${tarea.title} ${badgeVencida}</h6>
                        <small class="${colorTexto}">${tarea.description || 'Sin descripción'} • Vence: ${fecha}</small>
                    </div>
                </div>
                <div class="d-flex gap-2">
                    <button type="button" class="btn btn-light text-primary rounded-circle shadow-sm" onclick="prepararEdicion(event, ${tarea.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button type="button" class="btn btn-light text-danger rounded-circle shadow-sm" onclick="eliminarTarea(event, ${tarea.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
}
// 4. MANEJO DEL FORMULARIO

document.getElementById('form-tarea').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const datos = {
        title: document.getElementById('input-titulo').value,
        description: document.getElementById('input-descripcion').value,
        dueDate: document.getElementById('input-fecha').value
    };

    const metodo = idEdicion ? 'PUT' : 'POST';
    const url = idEdicion ? `${API_URL}/${idEdicion}` : API_URL;

    try {
        const res = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        if (res.ok) {
            try {
                const modalElement = document.getElementById('modalNuevaTarea');
                const modal = bootstrap.Modal.getInstance(modalElement) || bootstrap.Modal.getOrCreateInstance(modalElement);
                modal.hide();
            } catch (err) {}

            idEdicion = null;
            document.getElementById('form-tarea').reset();
            document.querySelector('#modalNuevaTarea .modal-title').innerText = "Crear Tarea";
            
            cargarDashboard(obtenerFiltroActivo());
        }
    } catch (error) {
        console.error("Error al guardar:", error);
    }
});


// 5. ACCIONES INDIVIDUALES

function prepararNuevaTarea() {
    idEdicion = null;
    document.getElementById('form-tarea').reset();
    document.querySelector('#modalNuevaTarea .modal-title').innerText = "Crear Tarea";
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalNuevaTarea'));
    modal.show();
}

async function prepararEdicion(e, id) {
    if (e) e.preventDefault(); // Detiene cualquier intento de refresco
    try {
        const res = await fetch(`${API_URL}/${id}`);
        if (res.ok) {
            const tarea = await res.json();
            
            document.getElementById('input-titulo').value = tarea.title;
            document.getElementById('input-descripcion').value = tarea.description;
            document.getElementById('input-fecha').value = new Date(tarea.dueDate).toISOString().split('T')[0];
            
            idEdicion = id;
            document.querySelector('#modalNuevaTarea .modal-title').innerText = "Editar Tarea";
            
            const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalNuevaTarea'));
            modal.show();
        }
    } catch (error) {
        console.error("Error al cargar:", error);
    }
}

async function completarTarea(e, id) {
    if (e) e.preventDefault();
    const res = await fetch(`${API_URL}/${id}/complete`, { method: 'PATCH' });
    if (res.ok) {
        cargarDashboard(obtenerFiltroActivo());
    } else {
        const error = await res.json();
        alert(error.message); 
    }
}


function eliminarTarea(e, id) {
    if (e) e.preventDefault(); //  Evita que el navegador recargue la página

    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esta acción!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ffc107', 
        confirmButtonText: '<strong style="color: black;">Sí, eliminar</strong>',
        cancelButtonText: 'Cancelar',
        reverseButtons: true 
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`${API_URL}/${id}`, { method: 'DELETE' })
            .then(response => {
                if(response.ok) {
                    cargarDashboard(obtenerFiltroActivo()); 

                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: 'Tarea eliminada',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true
                    });
                }
            });
        }
    });
}

function obtenerFiltroActivo() {
    const radioActivo = document.querySelector('input[name="btnradio"]:checked');
    return radioActivo ? radioActivo.id.replace('filtro-', '') : 'todas';
}

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        if (!e.target.innerText.includes('Dashboard')) {
            alert("Esta sección estará disponible en la versión 2.0");
        }
    });
});

cargarDashboard();