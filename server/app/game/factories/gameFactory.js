var chalk = require( "chalk" );
var Game = require( "../classes/game" );
var Deck = require( "../classes/deck" );
var Player = require( "../classes/player" );

function GameFactory() {}

function announceLoading() {
  console.log( chalk.yellow.bgRed( "[FB]" ), "Loading a game snapshot from Firebase. . ." );
}

function createFromSnap( snap ) {
  
  // attach the game object to its prototype
  var createdGame = snap.val();
  Object.setPrototypeOf( createdGame, Game.prototype );
  createdGame.ref = snap.ref();

  // now attach the player objects to their prototypes
  if ( createdGame.players ) {
    createdGame.players = createdGame.players.map( function( playerData ) {
      Object.setPrototypeOf( playerData, Player.prototype );
      return playerData;
    });
  }

  // we also need our decks to be attached to their prototypes, too
  if ( createdGame.state.decks ) {
    createdGame.state.decks = createdGame.state.decks.map( function( deckData ) {
      Object.setPrototypeOf( deckData, Deck.prototype );
      return deckData;
    });
  }

  // that's it, return the new game object
  console.log( chalk.yellow.bgRed( "[FB]" ), "Loaded a new game snapshot from Firebase" );
  return createdGame;
  
}

function errorCreatingGameFromRef( err ) {
  console.error( chalk.yellow.bgRed( "[FB]" ), chalk.red( "Error attaching game to Firebase ref:" ), err );
  return err;
}

var keysToDelete = ['ref','__proto__']
function sanitizeGame( game ) {

  keysToDelete.forEach( function( key ) {
    if ( game[key] !== undefined ) delete game[key];
  })

  return game;

}

// GameFactory.prototype.attachToFirebaseRef
// creates a new instance of the Game class with its data values attached to the Firebase database. The new game object
// will replace its values when new data is read from the server.
GameFactory.prototype.attachToFirebaseRef = function( ref ) {

  return new Promise( function( ok, fail ) {

    announceLoading();
    ref.on( "value", function( snap ) {

      try {
        ok( createFromSnap( snap ));
      } catch( err ) {
        fail( errorCreatingGameFromRef( err ));
      }

    }, function( err ) {
      fail( errorCreatingGameFromRef( err ));
    });

  });

}

// GameFactory.prototype.fetchFromFirebaseRef
// creates a new instance of the Game class with its data values retrieved from the Firebase database. The new game
// object is fetched once and never updated.
GameFactory.prototype.fetchFromFirebaseRef = function( ref ) {

  return new Promise( function( ok, fail ) {

    announceLoading();
    ref.once( "value", function( snap ) {

      if( !snap.exists() ) return fail( errorCreatingGameFromRef( new Error( "Game does not exist in database" )));

      try {
        ok( createFromSnap( snap ));
      } catch( err ) {
        fail( errorCreatingGameFromRef( err ));
      }

    }, function( err ) {
      fail( errorCreatingGameFromRef( err ));
    });

  });

}

// GameFactory.prototype.saveToFirebase
// saves a game attached to or created from Firebase back to the database. Requires that the game object has a ref key
// that contains the ref it was created from, or can be passed a second optional parameter.
GameFactory.prototype.saveToFirebase = function( refGame, ref ) {

  return new Promise( function( ok, fail ) {

    if ( refGame.ref === undefined && ref === undefined ) {
      return fail( new TypeError( "Game instance has no attached Firebase ref, no default provided." ));
    }

    ref = ref || refGame.ref;
    
    ref.update( sanitizeGame( refGame ), function( err ) {
      if ( err ) return fail( err );

      ok( refGame );
    });

  });

}

module.exports = new GameFactory();