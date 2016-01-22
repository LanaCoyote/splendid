angular.module( "SplendidGame" ).directive( "drawpile", function() {

  return {
    restrict: 'E',
    templateUrl: "js/game-view/directives/drawpile.html",
    scope: {
      count: '=',
      gem: '='
    },
    link: function( scope ) {

      scope.count = scope.count;
      scope.gem = scope.gem;
      scope.imageUrl = "images/" + scope.gem + ".png";

    }
  }

});