FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY CirKit.slnx .
COPY backend/Domain/Domain.csproj backend/Domain/
COPY backend/Application/Application.csproj backend/Application/
COPY backend/Infrastructure/Infrastructure.csproj backend/Infrastructure/
COPY backend/Presentation/Presentation.csproj backend/Presentation/
RUN dotnet restore

COPY backend/ backend/
RUN dotnet publish backend/Presentation/Presentation.csproj -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Presentation.dll"]
