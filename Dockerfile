# === Build Frontend ===
FROM node:20 AS frontend-build
WORKDIR /app
COPY frontend/MontagoFrontend/ ./
RUN npm run build

# === Build Backend ===
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY backend/MontagGo.API/*.csproj ./MontagGo.API/
WORKDIR /src/MontagGo.API
RUN dotnet restore
COPY backend/MontagGo.API/. .
RUN dotnet publish -c Release -o /app/publish

# === Combine Frontend + Backend ===
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Backend veröffentlichen
COPY --from=build /app/publish .

# Frontend-Build in Unterordner
COPY --from=frontend-build /app/dist ./frontend

EXPOSE 80
ENTRYPOINT ["dotnet", "MontagGo.API.dll"]
