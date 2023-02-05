# Inspectro
A HTTP Inspector to intercept and log any request to your service, provide ease-of-use for debugging http request. Inspired by Ngrok built-in /http/inspect

## Quick Start
```
$ docker pull iqballx/inspectro:latest
$ docker run -d -p 7865:7865 --name inspectro iqballx/inspectro
```

Open browser at `http://localhost:7865`. Fire up another service you want to use. Then enter the address of that service to base URL field inside Inspectro dashboard.

> **Important!** do note that inspectro running from inside docker container, adjust your base URL accordingly, for linux use 172.17.0.1 instead of localhost, for mac use host.docker.internal instead of localhost

Next change your base URL setting from Postman / your FE to `http://localhost:7865/proxy` this is inspectro proxy endpoint. Every API request to this endpoint will be proxied to your service, intercepting the request and response then display it to the dashboard via Server-Sent Events (SSE)

> checkout the video: https://youtu.be/EahJEcM_Fxw


Have fun!