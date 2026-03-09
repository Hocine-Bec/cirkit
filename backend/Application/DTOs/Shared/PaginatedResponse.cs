namespace Application.DTOs.Shared;
public record PaginatedResponse<T>(IEnumerable<T> Items, int TotalCount, int Page, int PageSize, int TotalPages);
