'use strict';
var chalk = require('chalk');

// Requires in ./db/index.js -- which returns a promise that represents
// mongoose establishing a connection to a MongoDB database.
//var startDb = require('./db');
var startFb = require('./app/fb_db');

// delete these lines
var Game = require('./app/game/classes/game');

startFb.then( function( ref ) {

  console.log( "Making the game" );
  var gamesRef = ref.child("games");
  var newGameRef = gamesRef.push( new Game() );
  console.log( "All done!" );

})
.then( null, function( err ) {
  console.error( "!!!!!!!! MOM HOLY FUCK" );
  console.error( err );
})

// Create a node server instance! cOoL!
var server = require('http').createServer();

var createApplication = function () {
    var app = require('./app');
    server.on('request', app); // Attach the Express application.
    require('./io')(server);   // Attach socket.io.
};

var startServer = function () {

    var PORT = process.env.PORT || 1337;

    server.listen(PORT, function () {
        console.log(chalk.blue('Server started on port', chalk.magenta(PORT)));
    });

};

// startFb.then(createApplication).then(startServer).catch(function (err) {
//     console.error(chalk.red(err.stack));
//     process.kill(1);
// });
