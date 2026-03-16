using System;

namespace ApiTodoList.Dtos;

public class CreateTask
{
        public required string Title { get; init; }
        public string? Description { get; init; }   
        public DateTime CreationDate { get; init; }    
        public DateTime DueDate { get; init; }
            
}
