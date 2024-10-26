#!/bin/bash
# Check if we already have a docker container with the correct name
CONTAINER_NAME="react-nestjs-boilerplate-postgres"
if docker container ls -a | grep "$CONTAINER_NAME" >/dev/null; then
    if docker ps | grep "$CONTAINER_NAME" > /dev/null; then
        echo "Container with name $CONTAINER_NAME is already running, doing nothing."
        exit 1
    fi
    echo "Starting existing container with name $CONTAINER_NAME"
    docker start "$CONTAINER_NAME"
else
    user="react-nestjs-boilerplate"
    password="mysecretpassword"
    if [ "$user" = "" ] || [ "$password" = "" ]; then
        echo "Please set the react-nestjs-boilerplate/postgres-user and react-nestjs-boilerplate/postgres-password keys in pass. See documentation for details."
        unset user
        unset password
        exit 1
    fi
    echo "Spinning up new development database container with name $CONTAINER_NAME."
    docker run --name "$CONTAINER_NAME" -p 6543:5432 -e POSTGRES_PASSWORD="$password" -e POSTGRES_USER="$user" -e POSTGRES_DB=react-nestjs-boilerplate_db -d postgres:16
    unset user
    unset password
fi
