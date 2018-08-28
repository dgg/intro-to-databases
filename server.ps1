docker pull postgres:10.5-alpine
docker tag postgres:10.5-alpine postgres:latest
docker run --name some-postgres -e POSTGRES_PASSWORD=1234 -p 5432:5432 -d postgres