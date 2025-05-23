# Build image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
COPY . .
RUN dotnet restore MontagGo.API.csproj
RUN dotnet publish MontagGo.API.csproj -c Release -o /out

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /out .
ENTRYPOINT ["dotnet", "MontagGo.API.dll"]
