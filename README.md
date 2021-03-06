# B'more 911 [![Build Status](https://travis-ci.org/cgross/bmore911.svg?branch=master)](https://travis-ci.org/cgross/bmore911)

B'more 911 is a single page app that shows the last 18 months (or so) of 911 calls inside Baltimore City in both a grid and mapped.  The 911 call data was courtesy of [Open Baltimore](https://data.baltimorecity.gov/Public-Safety/911-Calls-for-Service/xviu-ezkt).

### Features

* Sorting (click on column headers)
* Filtering (using the LIKE operator so its doing a table scan and therefore its a bit slow)
* Map & table are kepts in sync.  Clicking on a marker will scroll to and highlight the associated row.  Clicking on a row will pan to and highlight the associated marker.
* Data retrieved is limit to the first 500 records of any query.

### Platforms & Frameworks

* Database: Postgres on Amazon RDS
* Server:  
  * Javascript Backend Implementation: Node, Express, Typescript, Yarn
  * Java Backend Implementation: Java 8, SparkJava, JOOQ, Maven
* Client: React, Create-React-App, Yarn

### Configuration

Before running the app, you'll need a `config.json` in the root that specifies the connection parameters for the RDS database instance.  That is not included with the git repo.

### Prerequisites

Running, building, and testing all require both Node and Yarn be installed.  After cloning the repo,
you'll need to run `yarn` (no parameters) inside both the project root and client directories to download dependencies.

### Development Mode

To run in development mode, you'll need to start two processes:

* In project root directory: `yarn start`
* In client directory, also: `yarn start`

Then go to [http://localhost:3000](http://localhost:3000).

Both of these processes are using live-reload/watchers to automatically restart/reload as changes are made.

### Building & Running

To build, run `yarn build` in the project root.   To then run the build version do `node index.js`.

Then go to [http://localhost:3001](http://localhost:3001). 

### Testing

To run backend tests, in the project root run `yarn test`.  To run client tests, in the client directory also run `yarn test`.


# Alternative Java Backend Implementation

There is an another backend implementation in Java.  It uses Java 8, SparkJava, JOOQ, and Maven.

To run the Java backend, from the `java` directory, just do: `mvn compile exec:java`.

The Node and Java backend use the same ports so don't run them simultaneously.








