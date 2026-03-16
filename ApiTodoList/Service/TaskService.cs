using System;
using ApiTodoList.Dtos;
using ApiTodoList.Models;
using ApiTodoList.Interfaces;

namespace ApiTodoList.Service;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _repository;
    public TaskService(ITaskRepository repository)
    {
        _repository = repository;
    }

    private int ObtenerId(List<TaskModel> list)
    {
        if (list.Count == 0)  
        {
            return 1;
        }
        return list.Max(i=>i.Id) + 1;
    }

    public TaskModel CreateTask(string Title, string? Description, DateTime CreationDate, DateTime DueDate)
    {
        var list = _repository.GetAllTasks();
        
        int id = ObtenerId(list);
        TaskModel task = new TaskModel
        {
            Id = id,
            Title = Title,
            Description = Description,
            CreationDate = CreationDate,
            DueDate = DueDate,

        };
        list.Add(task);

        _repository.SaveAllTasks(list);
        return task;
    }

    List<TaskModel> ITaskService.GetAllTasks()
    {
        return _repository.GetAllTasks();
    }

    public TaskModel? GetTaskById(int id)
    {   
        var list = _repository.GetAllTasks();
        return list.FirstOrDefault(i => i.Id == id);
    }

    public void UpdateTask(UpdateTask task, int id)
    {
        var list = _repository.GetAllTasks();
        int Index= list.FindIndex(m=>m.Id == id);
        if (Index == -1)
        {
            throw new Exception ("No se ha encontrado la tarea");
        }

        var taskToUpdate = list[Index];
        taskToUpdate.Title = task.Title;
        taskToUpdate.Description = task.Description;
        taskToUpdate.DueDate = task.DueDate;
        taskToUpdate.TaskStatus = task.TaskStatus;
        
        list[Index] = taskToUpdate;
        _repository.SaveAllTasks(list);
    }

    public void DeleteTask(int id)
    {
        var list = _repository.GetAllTasks();
        list = list.Where(p=> p.Id != id).ToList();

        _repository.SaveAllTasks(list);
    }

    
}
