# Base Image mit SDK (für EF Core Tools im Container)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Projektdateien kopieren und Wiederherstellung
COPY . .
RUN dotnet restore MontagGo.API.csproj

# Optional: EF CLI installieren (für direkten Zugriff im Container)
RUN dotnet tool install --global dotnet-ef
ENV PATH="$PATH:/root/.dotnet/tools"

# Publish in /out
RUN dotnet publish MontagGo.API.csproj -c Release -o /out

# Runtime-Container (bleibt SDK für dotnet ef!)
FROM mcr.microsoft.com/dotnet/sdk:8.0
WORKDIR /app

# Tools erneut aktivieren (für Sicherheit)
ENV PATH="$PATH:/root/.dotnet/tools"

# Veröffentlichten Code kopieren
COPY --from=build /out .

# Startpunkt
ENTRYPOINT ["dotnet", "MontagGo.API.dll"]