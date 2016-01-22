var chalk = require( "chalk" );
var firebase = require( "../../fb_db" );
var fbutils = require( "../../fb_db/utils" );
var Game = require( "../../game/classes/game" );
var GameFactory = require( "../../game/factories/gameFactory" );
var router = require( "express" ).Router();

var gamesRef = null;
firebase.then( function( ref ) {
  gamesRef = ref.child( "games" ); 
  console.log( chalk.yellow.bgRed( "[FB]" ), chalk.green( "Successfully connected to Firebase root ref in /games/." )); 
})
.then( null, function( err ) {
  console.error( chalk.yellow.bgRed( "[FB]" ), chalk.red( "Could not attach to Firebase root ref in /games/:" ), err );
})

function badReqErr( res, message ) {
  res.status( 400 ).json( { failed: true, error: message } );
}

// GET /
// retrieves a list of all games, along with their player counts and titles
router.get( "/", function( req, res, next ) {

  gamesRef.once( "value", function ( snap ) {
    if ( !snap.exists() ) return next( new Error( chalk.yellow.bgRed( "[FB]" ) + "Path 'games' does not exist" ));

    var snapArray = fbutils.fbArrayToArray( snap.val() );
    var games = snapArray.map( function( game ) {
        var playerCount = game.players ? game.players.length : 0;

        return { $id: game.$id, title: game.title, players: playerCount }
    });

    res.status( 200 ).json( games );

  }, next )

});

// POST /
// creates a new game based off of the given defaults object. returns the id of the created game
router.post( "/", function( req, res, next ) {

  var defaults = req.body;
  // do some validation here?

  var newGame = new Game( defaults );
  var newGameRef = gamesRef.push( newGame );

  newGameRef.once( "value", function( snap ) {
    if ( !snap.exists() ) return next( new Error( chalk.yellow.bgRed( "[FB]" ) + "Game was not created" ));

    res.status( 201 ).json( snap.key() );

  }, next )

});

// POST /:id
// submits a new turn to the game with the given id
router.post( "/:id", function( req, res, next ) {

  var turn = req.body;

  if ( turn.player === undefined || typeof turn.player !== "number" ) {
    return badReqErr( res, "Turn origin player is malformed or nonexistant" );
  } else if ( turn.action === undefined || typeof turn.action !== "string" ) {
    return badReqErr( res, "Turn action is malformed or nonexistant" );
  }

  GameFactory.fetchFromFirebaseRef( gamesRef.child( req.params.id ))
  .then( function( game ) {
    return game.receiveTurn( turn )
  }, next )
  .then( function( game ) {
    if ( game === undefined ) return;

    return GameFactory.saveToFirebase( game );
  }, function( err ) {
    err.status = 400;
    next( err );
  })
  .then( function( game ) {
    if ( game === undefined ) return;

    res.status( 200 ).json( game );
  })
  .then( null, next );

});

// PUT /:id
// connects to a game in progress
router.put( "/:id", function( req, res, next ) {

  if ( req.body.$id === undefined ) {
    return badReqErr( res, "Must provide player id" )
  }

  //redo this
  GameFactory.fetchFromFirebaseRef( gamesRef.child( req.params.id ))
  .then( function( game ) {
    game.connectPlayer( req.body );
    return GameFactory.saveToFirebase( game );
  })
  .then( function( game ) {
    if ( game === undefined ) return;

    res.status( 200 ).json( game );
  })
  .then( null, next );

});

module.exports = router;