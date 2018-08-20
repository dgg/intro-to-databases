docker pull mongo:4.0.1-xenial
docker tag mongo:4.0.1-xenial mongo:4
docker run --name some-mongo -d -p 27017:27017 mongo:4 --smallfiles