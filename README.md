# Skin Care Project Sale System

## Docker Compose Instructions

Run the following command to build and start the containers in detached mode:

```bash
docker-compose -f docker-compose-production-v1.yml -p swp-webapi up --build -d
```

-   `-f`: Specifies the compose file to use
-   `-p`: Sets the project name
-   `--build`: Build images before starting containers
-   `-d`: Run containers in detached mode (background)

## Building for MacBook M Series (Apple Silicon)

For MacBook M-series processors (Apple Silicon), use the following command to build with the correct architecture:

Web-Services

```bash
docker buildx build --platform linux/amd64 -t web-service-swp:amd ./WebService
```

Api-Gateway

```bash
docker buildx build --platform linux/amd64 -t api-gateway-swp:amd ./ApiGateway
```

-   `--platform`: Specifies target platform architecture
-   `-t`: Tags the built image
-   `./WebService`: Build context directory

## Tagging Images After Build

To tag an image after it has been built, use the `docker tag` command. Here is an example:

```bash
docker tag source_image:tag target_image:tag
```

-   `source_image:tag`: The name and tag of the existing image
-   `target_image:tag`: The new name and tag for the image

For example, to tag the `web-service-swp:amd` image as `web-service-swp:latest`, use the following command:

```bash
docker tag web-service-swp:amd web-service-swp:latest
```


