angular.module( "SplendidGame" ).factory( "TurnFactory", function( $http, GAME_ID ) {

  var TurnFactory = {};
  var playerId = null;
  var gameURI = "/api/games/" + GAME_ID;

  $http.put( gameURI, { $id: "placeholder" })
  .then( function( res ) { return res.data })
  .then( function( game ) { playerId = game.players.length - 1 })
  .then( null, function( err ) { console.error( err.data ) });

  var sendTurnData = function( turnData ) {

    if ( playerId === null ) return console.error( "You aren't playing this game" );

    return $http.post( gameURI, turnData )
    .then( function( res ) { return res.data })
    .then( null, function( err ) { console.error( err.data ) });

  }

  var constructTurnData = function( action, tail ) {

    var turn = { player: playerId, action: action };

    for ( var k in tail ) {
      turn[ k ] = tail[ k ];
    }

    return turn;

  }

  TurnFactory.drawGems = function( gems ) {
    return sendTurnData( constructTurnData( "draw", { gems: gems }));
  }

  TurnFactory.buyProperty = function( tier, slot ) {
    return sendTurnData( constructTurnData( "buy", { tier: tier, slot: slot }));
  }

  return TurnFactory;

});