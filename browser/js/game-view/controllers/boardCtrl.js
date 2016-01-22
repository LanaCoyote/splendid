angular.module( "SplendidGame" ).controller( "BoardCtrl", function( $scope, GameFactory, TurnFactory ) {

  GameFactory.getBoard().then( function( board ) {

    //board.grid.reverse();
    $scope.board = board;

  });

  $scope.buyProperty = function( tier, slot ) {
    TurnFactory.buyProperty( tier, slot );
  }

  var selectedGems = [];
  $scope.selectGem = function( gem ) {
    var gemidx = selectedGems.indexOf( gem );
    if ( gemidx > -1 ) selectedGems.splice( gemidx, 1 );
    else selectedGems.push( gem );
  }

  $scope.isSelected = function( gem ) {
    return selectedGems.indexOf( gem ) > -1;
  }

  $scope.drawSelectedGems = function() {
    TurnFactory.drawGems( selectedGems )
    .then( function() {
      selectedGems = [];
      $scope.$digest();
    });
  }

});