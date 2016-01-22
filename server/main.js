'use strict';
var chalk = require('chalk');

// Requires in ./db/index.js -- which returns a promise that represents
// mongoose establishing a connection to a MongoDB database.
//var startDb = require('./db');
var startFb = require('./app/fb_db');

// delete these lines
var Game = require('./app/game/classes/game');


// Create a node server instance! cOoL!
var server = require('http').createServer();

var createApplication = function () {
    var app = require('./app');
    server.on('request', app); // Attach the Express application.
    // require('./io')(server);   // Attach socket.io.
};

var startServer = function () {

    var PORT = process.env.PORT || 1337;

    server.listen(PORT, function () {
        console.log( chalk.bgBlue( "[EX]" ), chalk.blue('Server started on port', chalk.magenta(PORT)));
    });

};

startFb.then( function( ref ) {

  console.log( chalk.yellow.bgRed( "[FB]" ), "Firebase ref received" );

})
.then( createApplication ).then( startServer ).then( function() {

  console.log( chalk.bgBlue( "[EX]" ), chalk.green( "Server started successfully!" ) );

})
.then( null, function( err ) {
  
  console.error( chalk.magenta( "An error occurred during server operation:" ) );
  console.error( err.stack );
  console.error( chalk.magenta( "The process will now terminate" ) )
  process.exit( 1 );

})
