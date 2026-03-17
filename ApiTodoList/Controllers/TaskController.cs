using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ApiTodoList.Models;
using ApiTodoList.Interfaces;
using ApiTodoList.Dtos;


namespace ApiTodoList.Controllers
{
    [Route("tasks")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly ITaskService _service;

        public TaskController(ITaskService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<List<TaskModel>> GetAll([FromQuery] string? status)
        {

            return Ok(_service.GetAllTasks(status));
        }

        [HttpGet ("{id}")]
        public ActionResult<List<TaskModel>> GetById(int id)
        {
            var TaskById = _service.GetTaskById(id);

            return TaskById != null ? Ok(TaskById) : NotFound(new {message = "Tarea no encontrada"});
        }

        [HttpPost]
        public ActionResult CreateTask(CreateTask newTask)
        {
            if (newTask.DueDate.Date < DateTime.Now.Date)
            {
                return BadRequest(new { message = "La fecha límite no puede ser anterior a hoy." });
            }
            
            var createdTask = _service.CreateTask(newTask.Title, newTask.Description, DateTime.Now ,newTask.DueDate);

            return CreatedAtAction(nameof(GetById), new { id = createdTask.Id }, createdTask);
        }

        [HttpPut ("{id}")]
        
        public ActionResult UpdateTask(int id, UpdateTask updatedTask)
        {
            
            _service.UpdateTask(updatedTask,id);

            return NoContent();//codigo 204

        }

        [HttpDelete ("{id}")]
        public ActionResult DeleteTask(int id)
        {
            try
            {
                _service.DeleteTask(id);
                return NoContent();//codigo 204
            }    
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message});
            }
        }

        [HttpPatch ("{id}/complete")]
        public ActionResult UpdateTaskStatus(int id)
        {
            
            try
            {
                _service.MarkAsCompleted(id);
                return NoContent(); // Devuelve 204 si todo salió bien
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
