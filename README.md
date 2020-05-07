# GraphComposer

This is being developed to provide a client for editing multilayer graphs.  This will eventually use a server based on one of the repositories [Graphs](https://github.com/smohr1824/Graphs) or [Networks](https://github.com/smohr1824/Networks). Graph definition, to include the 
visual representation of the elementary layers, remains in local application storage. Graph entities and relationships are passed to the server in GML format.

All algorithms, e.g., community detection, bipartness testing,  occur on the server.  Ultimately, it is the intention to provide progressive web application functionality such that a graph can be built offline and saved in GML format for later upload to the server.

Creation and editing of ML FCMs is expected to occur on the client, with the back-end
service providing algorithmic support, chiefly execution of the ML FCM state iteration.
App-local storage is used to persist the network definition. If 'Set Defn' is clicked when the
network name matches a stored definition, then the stored value will be read and entered into 
state.  When 'Upload' is clicked on the edit page for elementary layers, all network state,
to include the graphical layout of the elementary layer, will be persisted to application-local
storage, and the elementary layer will be rendered as GML without the x and y coordinates of 
the nodes. 

Status: unit and end-to-end tests remain to be written.  The UI is largely feature-complete.  
The ability to move nodes *may* be added. The ability to specify explicit inter-layer edges 
will be added.

We anticipate some refractoring such that the editor can be used for multilayer networks other than ML FCMs.  


## Hosting the application and REST API for development
The REST API is implemented in the [MLGraphService](https://github.com/smohr1824/MLGraphService) repository. CORS protections are disabled in the service to allow for 
separate hosting of the service and this application. Update the REST API URL in `environment.ts` to reflect the server and port of the development REST API server.

The server is implemented using the [C# repository](https://github.com/smohr1824/Graphs). An equivalent service using the [Go repository](https://github.com/smohr1824/Networks) is anticipated to offer the concurrent methods implemented therein. 

## Known Issues
1. The underlying ML FCM code in the Graphs repository does not permit proper deserialization of
networks with concept names including whitespace. For example "Public concern" must be "Public_concern".
2. Changing the name of a concept in the Actors page when the concept is used in an elementary layer does not change the displayed name in the elementary layer. You must delete the node, then
add it again.
3. Movement of nodes on an elementary layer is not yet supported.

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
