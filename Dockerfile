# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# copy csproj and restore
COPY backend/MontaGo.Api/*.csproj ./MontaGo.Api/
WORKDIR /src/MontaGo.Api
RUN dotnet restore

# copy the rest of the backend
COPY backend/MontaGo.Api/. .

# publish
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 80
ENTRYPOINT ["dotnet", "MontagGo.API.dll"]
