var Game = require( "./classes/game" );
var readline = require( "readline" );

var rlInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

var game = new Game();
game.connectPlayer( { $id: "abcdef" } );

console.dir( game );
(function next() {

  rlInterface.question( "Next turn?", function( turnString ) {

    var turn = JSON.parse( turnString );

    game.receiveTurn( turn )
    .then( function( newState ) {
      console.dir( newState );
    })
    .then( null, function( err ) {
      console.error( err );
    })
    .then( next );

  });

})()