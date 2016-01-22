angular.module( "SplendidGame" ).factory( "GameFactory", function( FireFactory, GAME_ID ) {

  var gameRef = FireFactory.getPath( "games/" + GAME_ID );
  var GameFactory = {};

  GameFactory.getState = function() {
    return gameRef.fetch();
  }

  GameFactory.getBoard = function() {

    var boardObject = gameRef.fetchChild( "state" );

    return boardObject.$loaded()
    .then( function( board ) {
      
      boardObject.decks = boardObject.decks.map( function( deck ) {
        return { length: deck.length };
      })

      return boardObject;

    })

  }

  GameFactory.getHands = function() {

    var handObject = gameRef.fetchChildArray( "players" );

    return handObject;

  }

  GameFactory.getHandsRef = function() {

    return gameRef.child( "players" );

  }

  GameFactory.getCurrentPlayer = function() {

    var playerObject = gameRef.fetchChild( "currentPlayer" );

    return playerObject;

  }

  return GameFactory;

})