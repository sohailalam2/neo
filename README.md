# Neo

## Description

This application uses [Nest](https://github.com/nestjs/nest) framework and TypeScript. There are several best practices and automation built into this project which will help the developer focus more on the actual development and writing code.

## Features

- Typescript support
- OOP and DI (IOC) using the [Nest](https://github.com/nestjs/nest) Framework
- Strict linting support via [TSLint](https://palantir.github.io/tslint/)
- Testing automation using [Jest](https://jestjs.io/docs/en)

## Prerequisites

- NodeJs v10 or above

## Installation

```bash
$ npm install
```

## Running the app

To run the application in different modes use the following:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

By default the server starts at `http://localhost:8080`

## Test

```bash
# unit tests
$ npm run test

# do TDD by watching test files and running unit test on file change
$ npm run test:watch

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### Linting

There is an extensive support for linting via ESLint which enforces strict rules. The following commands can be used to help lint or fix minor linting issues:

```bash
# Format the code
$ npm run format

# Auto fix linting issues
$ npm run lint
```
