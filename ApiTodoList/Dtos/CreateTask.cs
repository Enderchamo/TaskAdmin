using System;

namespace ApiTodoList.Dtos;

public class TaskDtos
{
        public required string Title { get; init; }
        public string Description { get; init; }
}
