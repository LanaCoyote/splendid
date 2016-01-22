angular.module( "SplendidGame" ).directive( "card", function() {

  return {
    restrict: 'E',
    templateUrl: "js/game-view/directives/card.html",
    scope: {
      data: '='
    },
    link: function( scope ) {

      scope.gem = scope.data.gem;
      scope.cost = scope.data.cost;
      scope.value = scope.data.value > 0 ? scope.data.value : undefined;
      scope.imageUrl = scope.data.imageUrl || "http://www.fillmurray.com/150/200";

    }
  }

});