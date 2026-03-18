using System;
using System.Text.Json;
using ApiTodoList.Models;
using ApiTodoList.Service;

namespace ApiTodoList.Persistence;

public class JsonTaskRepository : ITaskRepository
{
    private readonly string _filePath = "tasks.json";

    public List<TaskModel> GetAllTasks()
    {
        if (!File.Exists(_filePath))
        {
            return new List<TaskModel>();
        }

        try 
        {
            string text = File.ReadAllText(_filePath);
            var TaskList = JsonSerializer.Deserialize<List<TaskModel>>(text);
            return TaskList ?? new List<TaskModel>();
        }
        catch (JsonException) 
        {
        
            return new List<TaskModel>(); 
        }
    }

    public void SaveAllTasks(List<TaskModel> tasks)
    {
        var options = new JsonSerializerOptions { WriteIndented = true };
        string text = JsonSerializer.Serialize(tasks, options);
        File.WriteAllText(_filePath, text);
    }
}
