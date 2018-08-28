docker pull dpage/pgadmin4:3.2
docker tag dpage/pgadmin4:3.2 pgadmin4:latest

docker run --name some-pgadmin4 -p 5050:80 -e "PGADMIN_DEFAULT_EMAIL=admin@pgadmin.org" -e "PGADMIN_DEFAULT_PASSWORD=admin" --link some-postgres:postgres -d pgadmin4

Start-Process "http://localhost:5050" 