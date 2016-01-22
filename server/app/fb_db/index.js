var chalk = require( 'chalk' );
var Firebase = require( 'firebase' );

var FIREBASE_URI = "https://incandescent-heat-6265.firebaseio.com/";

function connectToFirebase( uri ) {

  return new Promise( function( ok, fail ) {

    // create a reference to our firebase db
    console.log( chalk.yellow.bgRed( "[FB]" ), "Connecting to Firebase at URI:", chalk.yellow( uri ), ". . ." );
    var ref = new Firebase( uri );

    ref.once( "value", function ( ss ) {

      console.log( chalk.yellow.bgRed( "[FB]" ), chalk.green( "Connection was successful!" ) );
      ref.connected = true;
      ok( ref );
  
    }, function( err ) {

      console.log( chalk.yellow.bgRed( "[FB]" ), chalk.red( "Connection failed:" ), err );
      fail( err );

    } );

  });

}

module.exports = connectToFirebase( FIREBASE_URI );