angular.module( "SplendidGame" ).controller( "HandCtrl", function( $scope, GameFactory ) {

  // var hands = GameFactory.getHands();
  // hands.on( "value", function( snap ) {

  //   $scope.hands = snap.val();

  // });
  var handRef = GameFactory.getHandsRef();
  handRef.on( "value", function( snap ) {

    $scope.$apply( function() {
      $scope.hands = snap.val();
    });

  });

  $scope.currentPlayer = GameFactory.getCurrentPlayer();

});