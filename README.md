# Vision Store website

## First time setup

### Install frontend deps

```terminal
cd frontend && yarn && cd ..
```

### Install fallback server deps

```terminal
cd fallback_server && yarn && cd ..
```

<!-- ### Install api_server deps

```terminal
cd api_server && npm i && cd ..
``` -->

## Docker commands

### Run it locally

```terminal
docker-compose -f docker-compose.dev.yml up -d --build
```

Then go to: [127.0.0.1](http://127.0.0.1/) for Frontend, and [127.0.0.1/api](http://127.0.0.1/api) for backend .Also, u can browse the api by going to [127.0.0.1:3000/explorer](http://127.0.0.1:3000/explorer).

Please note that to run the dev environment on your local machine, you need to create an environment file in ``../config/env-vars.dev.env`` (out side the repo, up one level) and add the following lines to it:

``` .env
# mailer credential
MAIL_ADDRESS=your-dev-email@gmail.com
MAIL_PASSWORD=your-dev-email-password
```

This is the environment vars for the api server

#### To restart Dev

```terminal
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d --build
```
