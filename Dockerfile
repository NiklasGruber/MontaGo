# build environment
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# copy csproj and restore as distinct layers
COPY ./backend/MontagGo.API/*.csproj ./backend/MontagGo.API/
RUN dotnet restore ./backend/MontagGo.API/MontagGo.API.csproj

# copy everything else and build
COPY . ./
RUN dotnet publish ./backend/MontagGo.API/MontagGo.API.csproj -c Release -o out

# build frontend
FROM node:20 AS frontend-build
WORKDIR /frontend
COPY ./frontend/MontagoFrontend/package*.json ./
RUN npm install
COPY ./frontend/MontagoFrontend ./
RUN npm run build

# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out ./
COPY --from=frontend-build /frontend/dist ./frontend
ENTRYPOINT ["dotnet", "MontagGo.API.dll"]
