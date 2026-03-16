using System;

namespace ApiTodoList.Models;

public class Task
{
        public required int Id { get; set; }
        public required string Title { get; set; }
        public string Description { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime DueDate { get; set; }
        public bool TaskStatus  { get; set; }
}
