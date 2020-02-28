# TaskManagerUi

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.3.

This project work with sprig [Task Manager](https://github.com/azizparmaksiz/task-manager).

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# Build Docker image
## Requirements
- [Docker](https://docs.docker.com/install)

Run `docker build -f Dockerfile -t docker-task-manager-ui .` to build docker image.
Instead "docker-task-manager-ui" you can give your own docker image name.

## Running Docker Image locally

Run `docker run -p 4200:80 docker-task-manager-ui`

## Run Docker image from docker hub

You can pull generated image of this project `docker pull azizparmaksiz/docker-task-manager-ui`.

Run `docker run -p 4200:80 azizparmaksiz/docker-task-manager-ui`
