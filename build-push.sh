#!/bin/bash

echo "building v$1";
docker build --rm --compress -t iqballx/inspectro:$1 -t iqballx/inspectro:latest . && \
    docker push -a iqballx/inspectro