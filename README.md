# GraphComposer

This is being developed to provide a client for editing multilayer graphs.  This will eventually use a server based on one of the repositories [Graphs](https://github.com/smohr1824/Graphs) or [Networks](https://github.com/smohr1824/Networks). The client will retain enough state to render a graph, but actions with side-effects, e.g., node deletion, will be performed on the server and result in a refresh of the client's state.  All algorithms, e.g., community detection, bipartness testing, will occur on the server.  Ultimately, it is the intention to provide progressive web application functionality such that a graph can be built offline and saved in GML format for later upload to the server.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
