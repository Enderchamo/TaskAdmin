using System;
using ApiTodoList.Models;

namespace ApiTodoList.Service;

public interface ITaskRepository
{
    List<TaskModel> GetAllTasks(); 
    void SaveAllTasks(List<TaskModel> tasks); 

}
