### Redis Setup with Docker

1. Pull and Run Redis Container

```bash
# Pull and run Redis container in detached mode
docker run --name redis -p 6379:6379 -d redis
```

2. Verify Redis Container

```bash
# Check if container is running
docker ps | grep redis

# Test Redis connection
docker exec -it redis redis-cli ping
```

3. Container Management

```bash
# Stop Redis container
docker stop redis

# Start Redis container
docker start redis

# Remove Redis container
docker rm redis
```

Note: Make sure Docker is installed and running on your system before executing these commands.

### Environment Variables Setup

Create a `.env` file in the root directory with the following configuration:

```env
# Database Configuration
DATABASE_HOST=
DATABASE_PORT=
DATABASE_NAME=
DATABASE_USERNAME=
DATABASE_PASSWORD=

# JWT Configuration
# JWT Configuration
JWT_ISSUER=     //JWT issuer name
JWT_AUDIENCE=   //JWT audience identifier
JWT_KEY=        //Secret key for JWT signing

# Redis Configuration
REDIS_HOST=
REDIS_PORT=
```


1. Navigate to API Gateway Directory

```bash
# Go to API Gateway project
cd ApiGateway
```

2. Install Dependencies and Build

```bash
# Restore dependencies
dotnet restore

# Build the project
dotnet build
```

3. Run API Gateway

```bash
# Start the API Gateway
dotnet run
```

Note: The API Gateway must be running before starting other services.


### Run WebServices

1. Clean and Restore Project

```bash
# Clean solution
dotnet clean

# Restore dependencies
dotnet restore
```

2. Run Web API

```bash
# Navigate to Web.API project
cd Web.API

# Run the project
dotnet run
```

Note: Ensure you have .NET SDK installed on your system.