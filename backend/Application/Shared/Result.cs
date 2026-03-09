namespace Application.Shared;

public class Result
{
    protected Result(bool isSuccess, string error, ErrorType errorType)
    {
        IsSuccess = isSuccess;
        Error = error;
        ErrorType = errorType;
    }

    public bool IsSuccess { get; }
    public string Error { get; }
    public ErrorType ErrorType { get; }

    public static Result Success { get; } = new(true, string.Empty, default);

    public static Result Failure(string error, ErrorType errorType) =>
        new(false, error, errorType);
}

public class Result<T> : Result
{
    private Result(T value) : base(true, string.Empty, default)
    {
        Value = value;
    }

    private Result(string error, ErrorType errorType) : base(false, error, errorType)
    {
        Value = default;
    }

    public T? Value { get; }

    public new static Result<T> Success(T value) => new(value);

    public new static Result<T> Failure(string error, ErrorType errorType) =>
        new(error, errorType);
}
