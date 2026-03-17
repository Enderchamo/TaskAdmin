using System;
using ApiTodoList.Dtos;
using ApiTodoList.Models;

namespace ApiTodoList.Interfaces;

public interface ITaskService
{
    List<TaskModel> GetAllTasks(string? status = null);
    public TaskModel? GetTaskById(int id);

    void UpdateTask(UpdateTask task, int id);

    void DeleteTask(int id);

    public TaskModel CreateTask( string Title,string? Description,DateTime CreationDate,DateTime DueDate);

    void MarkAsCompleted(int id);

}
