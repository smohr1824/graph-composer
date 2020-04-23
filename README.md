# GraphComposer

This is being developed to provide a client for editing multilayer graphs.  This will eventually use a server based on one of the repositories [Graphs](https://github.com/smohr1824/Graphs) or [Networks](https://github.com/smohr1824/Networks). The client will retain enough state to render a graph, but actions with side-effects, e.g., node deletion, will be performed on the server and result in a refresh of the client's state.  All algorithms, e.g., community detection, bipartness testing, will occur on the server.  Ultimately, it is the intention to provide progressive web application functionality such that a graph can be built offline and saved in GML format for later upload to the server.

Creation and editing of ML FCMs is expected to occur on the client, with a (planned) back-end
service providing algorithmic support, chiefly execution of the ML FCM state iteration.
App-local storage is used to persist the network definition. If 'Set Defn' is clicked when the
network name matches a stored definition, then the stored value will be read and entered into 
state.  When 'Upload' is clicked on the edit page for elementary layers, all network state,
to include the graphical layout of the elementary layer, will be persisted to application-local
storage, and the elementary layer will be rendered as GML without the x and y coordinates of 
the nodes. Eventually, the layer will be sent to the back-end service.

Status: unit and end-to-end tests remain to be written.  The UI is feature-complete except
for the ML FCM execution. We anticipate this looking like a grid of concept state vectors, 
with some way to specify which actors to display.  The back-end service remains to be written.
We expect to use the Go language repository as the basis of this service as it provides support 
for concurrency lacking in the C# repository.  Also remaining is some refractoring such that the editor can be used for multilayer networks other than ML FCMs.  

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
