var game = angular.module( "SplendidGame", ["FirebaseWrapper"] );

game.constant( "GAME_ID", window.location.pathname.split( '/' ).pop() );
