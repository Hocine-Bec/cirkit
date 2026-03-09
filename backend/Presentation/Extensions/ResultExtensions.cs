using Application.Shared;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Extensions;

public static class ResultExtensions
{
    public static IActionResult HandleResult<T>(this Result<T> result)
    {
        if (result.IsSuccess)
            return new OkObjectResult(result.Value);

        return result.ErrorType switch
        {
            ErrorType.NotFound      => new NotFoundObjectResult(new { detail = result.Error }),
            ErrorType.BadRequest    => new BadRequestObjectResult(new { detail = result.Error }),
            ErrorType.Conflict      => new ConflictObjectResult(new { detail = result.Error }),
            ErrorType.Unauthorized  => new UnauthorizedObjectResult(new { detail = result.Error }),
            ErrorType.Forbidden     => new ObjectResult(new { detail = result.Error }) { StatusCode = 403 },
            _                       => new ObjectResult(new { detail = result.Error ?? "An unexpected error occurred" }) { StatusCode = 500 }
        };
    }

    public static IActionResult HandleResult<T>(this Result<T> result, int successStatusCode)
    {
        if (result.IsSuccess)
            return new ObjectResult(result.Value) { StatusCode = successStatusCode };

        return result.HandleResult();
    }
}
