docker pull redis:4.0.11-alpine
docker tag redis:4.0.11-alpine redis:latest
docker run --name some-redis -d -p 6379:6379 redis