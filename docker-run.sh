#!/bin/bash
docker build -t stat-app:latest . && docker-compose -f ./stat-app.dev.yaml up
# or run docker vs default ENV
#docker build -t stat-app:latest . && docker run --name stat-app -p 3344:3000 stat-app:latest
