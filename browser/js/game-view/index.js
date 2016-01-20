var game = angular.module( "SplendidGame", ["firebase"] );

game.constant( "DB_URI", "https://incandescent-heat-6265.firebaseio.com/" );
game.constant( "GAME_ID", "testGame" );

game.run( function( $rootScope, $firebaseObject, DB_URI, GAME_ID ) {

  if ( !DB_URI ) {
    console.error( "Can't connect to game: database URI is not configured." )
  } else if ( !GAME_ID ) {

    console.error( "Can't connect to game: don't know what game to connect to!" );

  } else {

    // connect to our firebase game instance
    $rootScope._gameRef = new Firebase( DB_URI + '/games/' + GAME_ID );

  }

});

game.controller( "TestCtrl", function( $scope, $rootScope, $firebaseObject, DB_URI ) {

  // $scope.gameState = $rootScope.gameState;
  $scope.title = "Working!";

  $scope.game = $firebaseObject( $rootScope._gameRef );

})