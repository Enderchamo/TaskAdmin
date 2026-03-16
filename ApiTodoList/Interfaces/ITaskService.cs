using System;
using ApiTodoList.Dtos;
using ApiTodoList.Models;

namespace ApiTodoList.Interfaces;

public interface ITaskService
{
    List<TaskModel> GetAllTasks();
    public TaskModel? GetTaskById(int id);

    void UpdateTask(UpdateTask task, int id);

    void DeleteTask(int id);

    public TaskModel CreateTask( string Title,string? Description,DateTime CreationDate,DateTime DueDate);

    void UpdateTaskStatus(int id, bool status);

}
