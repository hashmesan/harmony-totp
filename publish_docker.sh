if docker build -t relayer .; then
    docker tag relayer hashmesan/relayer:latest
    docker push hashmesan/relayer:latest
fi