angular.module( "SplendidGame" ).directive( "gem", function() {

  return {
    restrict: 'E',
    templateUrl: "js/game-view/directives/gem.html",
    scope: {
      type: '=',
      width: '=',
      height: '='
    },
    link: function( scope ) {

      scope.width = scope.width || 32;
      scope.height = scope.height || 32;

    }
  }

});