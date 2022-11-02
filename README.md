# Data Challenge Box

> A backend service and a cronjob for pushing GitHub and Spotify metrics to Databox platform.

## Table of Contents

* [General Info](#general-information)
* [Technologies Used](#technologies-used)
* [Setup](#setup)
* [Usage](#usage)
* [Room for Improvement](#room-for-improvement)
* [Licence](#licence)

## General Information

- It can be used as an REST API or as a cronjob
- It pushes three GitHub metrics to Databox: `comments`, `releases` and `stars` for a chosen GitHub repository. It uses
  personal access token.
- It pushes three Spotify metrics to Databox: `categoryPlaylists`, `playlistItems` and `userPlaylists` for a chosen
  Spotify category / playlist / user. It uses OAuth2 for authentication.
- This project was made for a Databox Backend Engineering Challenge.

## Technologies Used

- [Node.js](https://nodejs.org/en/) development environment
- [Typescript](https://www.npmjs.com/package/typescript) language
- [Databox](https://www.npmjs.com/package/databox) for pushing KPIs to Databox platform
- [Octokit](https://www.npmjs.com/package/octokit) GitHub SDK
- [Express](https://www.npmjs.com/package/express) web framework for Node.js
- [Luxon](https://www.npmjs.com/package/luxon) for working with dates and times
- [Pino](https://www.npmjs.com/package/pino) Node.js logger
- [Jest](https://www.npmjs.com/package/jest) testing framework
- [Node-Cron](https://www.npmjs.com/package/node-cron) for task schedule

## Setup

1. Make sure you have Node.js and npm package manager installed.
2. Install the dependencies: `npm i`
3. Config environment variables in a new `./.env` file. All needed variables are listed in `./.env.example`
   folder.

## Usage

Before you start the service, decide how do you want to use the service: as a cronjob or as a rest API.

### Cronjob

If you want to use the service as a cronjob, set environment variable `CRON=true` and configure execution time with
variable `CRON_EXPRESSION=*/10 * * * * *`.

### Rest API

If you want to use the service rest API, set environment variable `CRON=false`. Following routes are exposed:

- `/data-challenge-box/api/v1/github/metrics` - sends all metrics
- `/data-challenge-box/api/v1/github/repoComments` - sends comments metric
- `/data-challenge-box/api/v1/github/repoReleases` - sends releases metric
- `/data-challenge-box/api/v1/github/repoStars` - sends stars metric
- `/data-challenge-box/api/v1/spotify/metrics` - sends all metrics
- `/data-challenge-box/api/v1/spotify/categoryPlaylists` - sends category playlists metric
- `/data-challenge-box/api/v1/spotify/playlistItems` - sends playlist items metric
- `/data-challenge-box/api/v1/spotify/userPlaylists` - sends user playlists metric

All routes except `GET` requests on the port 8000.

---

After you decided how you want to use the service, start it with the `npm run start` command.

The data sent to Databox platform is stored locally in `log` file in root folder.

## Room for Improvement

Nothing is perfect in life, neither is Data Challenge Box. This is an uncompleted list of improvements
that could be done:

- add declaration types in .src/@types for Databox library
- add Swagger documentation
- abstractions:
    - all controllers functions can be replaced with a generic one
    - both service functions can be replaced with a generic one
- edge case test scenarios
- containerize the service

Some features that would make this service better:

- Currently access to GitHub metrics is done via personal access token and to Spotify via OAuth2 `client_credentials`
  flow. Implementation of other OAuth2 flows would extend the scope of the metrics that can be retrieved from resources.
- All resources (repository, playlists etc.) are currently hardcoded in the code. They should be set as environment
  variables.
- Cronjob is executed with the help of `node-cron` library. Alternatives are:
    - Serverless function with trigger (eg: AWS Lambda)
    - Job queue (eg: Bull with Redis)
    - OS scheduler (eg: Crontab on Linux)

## Licence

MIT
