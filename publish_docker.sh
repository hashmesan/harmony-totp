docker build -t relayer .
docker tag relayer hashmesan/relayer:latest
docker push hashmesan/relayer:latest