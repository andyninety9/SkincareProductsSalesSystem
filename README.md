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