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

## API

The following APIs are supported, a Postman collection is also available for download from [here](/mocks/Neo%20Api.postman_collection.json).

### GET /health

Get the health of the application

### GET /inventory

Get the list of all inventory items

### PUT /inventory

Upload the list of inventory items to the db

A 400 Bad Request error is sent if the upload file is corrupted or is not in the expected format

### GET /products

Get the list of products

### PUT /products

Upload the list of products to the db

A 400 Bad Request error is sent if the upload file is corrupted or is not in the expected format

### GET /products/:name

Get a product by its name

A 404 Not Found error response is sent if the item is not found

### DELETE /products/:name

Delete a given product and update the inventory stock
