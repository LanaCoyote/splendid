angular.module( "SplendidGame" ).directive( "cost", function() {

  return {
    restrict: 'E',
    templateUrl: "js/game-view/directives/cost.html",
    scope: {
      data: '='
    },
    link: function( scope ) {

    }
  }

});