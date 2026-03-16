using System;

namespace ApiTodoList.Dtos;

public class UpdateTask
{
    public required string Title { get; init; }
    public string Description { get; init; }

    public bool TaskStatus { get; init; }
}
