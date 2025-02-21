# ShowCompanyLogo Project

A full-stack application for company logo management with React frontend, .NET API backend and WordPress integration.

## Features

- User authentication system
- Logo upload/management
- REST API endpoints
- WordPress CMS integration
- Dockerized deployment

## Requirements

- Node.js 18+
- .NET 9.0 SDK
- Docker Desktop

## Project Structure

```
├── Client/         # React frontend
├── Server/         # .NET backend API
├── Docker/         # Docker configurations
│   ├── nginx/
│   └── wordpress/
```

## Getting Started

### Frontend Setup
```bash
cd Client
npm install
npm run dev
```

### Backend Setup
```bash
cd Server/Api
dotnet run
```

### Docker Deployment
```bash
cd Docker/wordpress
docker-compose up -d
```

## Documentation

- [API Reference](/Server/Api/Api.http)
- [Theme Customization](/Docker/wordpress/wp-content/themes/)
