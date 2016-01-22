angular.module( "SplendidGame" ).directive( "hand", function() {

  var defaultGems = {
    "ruby": 0,
    "sapphire": 0,
    "emerald": 0,
    "diamond": 0,
    "chocolate": 0,
    "gold": 0
  }

  return {
    restrict: 'E',
    templateUrl: "js/game-view/directives/hand.html",
    scope: {
      player: '=',
      iscurplayer: '&'
    },
    link: function( scope ) {

      scope.hand = scope.player.hand;
      scope.gems = scope.player.gems || {};
      scope.reserves = scope.player.reserves;

      for ( var gem in defaultGems ) {
        if ( scope.gems[ gem ] === undefined ) scope.gems[ gem ] = defaultGems[ gem ];
      }

      scope.getPoints = function() {

        if ( scope.hand === undefined ) return 0;

        return scope.hand.reduce( function( sum, card ) {
          return sum + card.value;
        }, 0 );

      }

      scope.getGems = function( type ) {

        if ( scope.hand === undefined ) return 0;

        var total = scope.hand.reduce( function( sum, card ) {
          if ( card.gem === type ) sum++;
          return sum;
        }, 0 );

        if ( scope.gems[ type ] ) total += scope.gems[ type ];
        return total;

      }

    }
  }

});