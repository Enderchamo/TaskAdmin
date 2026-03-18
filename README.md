Task Manager - API REST y Frontend

Este es un sistema ligero para gestionar las tareas internas de la empresa. Está compuesto por una API construida en C# y un frontend consumido con JavaScript puro.

Características del proyecto:

Permite crear, listar, editar y eliminar tareas.

Filtrado de tareas (Todas, Pendientes, Completadas).

Opción para marcar tareas como completadas.

Los datos se guardan de forma local en un archivo tasks.json, cumpliendo la regla de no usar base de datos.

Previene que la página se recargue al hacer acciones gracias a llamadas asíncronas (fetch).

Tecnologías usadas:

Backend: C# (.NET), System.Text.Json

Frontend: HTML, CSS, JavaScript, Bootstrap 5, SweetAlert2

Como ejecutar el sistema:

Para la API (Backend):
Abre la consola en la carpeta ApiTodoList y ejecuta el comando:
dotnet run
El servidor iniciará en http://localhost:5224

Para la Web (Frontend):
Simplemente abre el archivo Index.html de la carpeta Front-End en cualquier navegador.

Rutas principales de la API:

GET /tasks (Soporta filtros ?status=completed o pending)

GET /tasks/{id}

POST /tasks

PUT /tasks/{id}

PATCH /tasks/{id}/complete

DELETE /tasks/{id}

Notas de validación:
La API está configurada para devolver error 400 si se intenta enviar un título vacío o una fecha pasada. También tiene un try-catch para evitar que el programa se caiga si el archivo tasks.json se llega a corromper manualmente.