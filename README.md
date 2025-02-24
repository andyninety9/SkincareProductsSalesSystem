# Skin Care Project Sale System
## Docker Compose Instructions

Run the following command to build and start the containers in detached mode:

```bash
docker-compose -f docker-compose-production-v1.yml -p swp-webapi up --build -d
```

- `-f`: Specifies the compose file to use
- `-p`: Sets the project name
- `--build`: Build images before starting containers
- `-d`: Run containers in detached mode (background)

## Building for MacBook M Series (Apple Silicon)

For MacBook M-series processors (Apple Silicon), use the following command to build with the correct architecture:

```bash
docker buildx build --platform linux/amd64 -t web-service-swp:amd ./WebService
```

- `--platform`: Specifies target platform architecture
- `-t`: Tags the built image
- `./WebService`: Build context directory