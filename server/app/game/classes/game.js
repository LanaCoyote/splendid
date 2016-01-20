var Deck = require( "./deck" );
var Player = require( "./player" );
var deckData = require( "../data/cards" );

function Game( defaults ) {

  this.title = "Splendid Game";//defaults.title || "Splendid Game";
  this.players = [];
  this.currentPlayer = 0;
  
  this.state = {};
  this.state.decks = [ new Deck( deckData.tier1 ), new Deck( deckData.tier2 ), new Deck("[]") ];

  var initialLayout = [
    [ this.state.decks[0].draw(), this.state.decks[0].draw(), this.state.decks[0].draw(), this.state.decks[0].draw() ],
    [ this.state.decks[1].draw(), this.state.decks[1].draw(), this.state.decks[1].draw(), this.state.decks[1].draw() ],
    [ this.state.decks[2].draw(), this.state.decks[2].draw(), this.state.decks[2].draw(), this.state.decks[2].draw() ]
  ];
  this.state.grid = new Grid( initialLayout );

  this.state.drawPiles = {};
  this.state.drawPiles.ruby = 6;//defaults.rubies || 6;
  this.state.drawPiles.sapphire = 6;//defaults.sapphires || 6;
  this.state.drawPiles.emerald = 6;//defaults.emeralds || 6;
  this.state.drawPiles.diamond = 6;//defaults.diamonds || 6;
  this.state.drawPiles.chocolate = 6;//defaults.chocolates || 6;
  this.state.drawPiles.gold = 6;//defaults.gold || 6;

  var nobleDeck = new Deck("[]");
  this.state.nobles = [ nobleDeck.draw(), nobleDeck.draw(), nobleDeck.draw(), nobleDeck.draw() ];

  this.turns = [];

}

Game.prototype.actDraw = function( turn ) {

  if ( turn.gems.indexOf( "gold" ) > 0 ) {
    throw new Error( "You cannot draw gold gems" );
  } else if ( this.players[ turn.player ].totalGems > 10 - turn.gems.length ) {
    throw new Error( "You can only have a maximum of 10 gems" );
  }

  if ( turn.gems.length === 3 ) {

    var game = this;
    turn.gems.forEach( function( gem ) {
      if ( game.state.drawPiles[ gem ] > 0 ) {
        game.players[ turn.player ].addGems( gem, 1 );
        game.state.drawPiles[ gem ]--;
      } else {
        throw new Error( "Tried to draw from " + gem + " pile when it was empty" );
      }
    })

  } else if ( turn.gems.length === 1 ) {

    if ( this.state.drawPiles[ turn.gems[0] ] >= 4 ) {
      this.players[ turn.player ].addGems( turn.gems[0], 2 );
      this.state.drawPiles[ turn.gems[0] ] -= 2;
    } else {
      throw new Error( "There must be at least 4 gems in a pile to draw 2" );
    }

  } else {
    throw new Error( "Invalid draw action" );
  }

}

Game.prototype.actReserve = function( turn ) {

  if ( turn.tier > 3 || turn.tier < 1 ) {
    throw new Error( "Tried to reserve from an unknown tier" );
  }

  this.players[ turn.player ].reserveCard( this.getDeck( turn.tier ).draw() );
  this.players[ turn.player ].addGems( "gold", 1 )

} 

Game.prototype.actBuy = function( turn ) {

  if ( turn.tier > 3 || turn.tier < 1 ) {
    throw new Error( "Tried to buy from an unknown tier" );
  } else if ( turn.slot < 0 || turn.slot > 3 ) {
    throw new Error( "Tried to buy from an unknown slot" );
  }

  var card = this.getCardInSlot( turn.tier, turn.slot );
  for ( var gem in card.cost ) {
    if ( this.players[ turn.player ].getGems( gem ) < card.cost[ gem ] ) {
      throw new Error( "You can't afford that card" );
    }
  }

  for ( var gem in card.cost ) {
    this.players[ turn.player ].takeGems( gem, card.cost[ gem ] );
  }
  this.players[ turn.player ].addCard( card );

  this.replaceSlot( turn.tier, turn.slot );

}

Game.prototype.connectPlayer = function( user ) {
  if ( this.players.length >= 4 ) {
    throw new Error( "Game is full" );
  }

  this.players.push( new Player( user ) );
}

Game.prototype.getDeck = function( tier ) {
  return this.state.decks[ tier - 1 ];
}

Game.prototype.getCardInSlot = function( tier, slot ) {
  return this.state.grid[ tier - 1 ][slot];
}

Game.prototype.replaceSlot = function( tier, slot ) {
  this.state.grid[ tier - 1 ].splice( slot, 1 );
  this.state.grid[ tier - 1 ].push( this.getDeck( tier ).draw() );
}

Game.prototype.checkState = function() {

  // check for nobles
  this.state.nobles.forEach( function( noble ) {
    if ( noble === undefined ) return;

    for ( var gem in noble.cost ) {
      if ( this.players[ this.currentPlayer ].getGems( gem ) < noble.cost[ gem ] ) {
        return
      }
    }

    this.players[ this.currentPlayer ].addCard( noble );
  });

}

Game.prototype.receiveTurn = function( turn ) {

  var game = this;

  return new Promise( function( ok, fail ) {

    if ( turn.player !== game.currentPlayer ) {
      return fail( new Error( "It's not your turn yet!" ) );
    }

    try {

      game.routeTurn( turn );
      game.checkState();

      game.currentPlayer = ( game.currentPlayer + 1 ) % game.players.length;

      return ok( game );

    } catch ( err ) {
      fail( err );
    }

  });

}

var validActions = {
  "draw" : Game.prototype.actDraw,
  "reserve" : Game.prototype.actReserve,
  "buy" : Game.prototype.actBuy,
  "pass" : function() {}
}
Game.prototype.routeTurn = function( turn ) {

  if ( validActions[ turn.action ] === undefined ) {
    throw new Error( "Unknown action: " + turn.action );
  } else {
    validActions[ turn.action ].call( this, turn );
  }

}

function Grid( initialLayout ) {

  this[0] = initialLayout[0] || [];
  this[1] = initialLayout[1] || [];
  this[2] = initialLayout[2] || [];

}


module.exports = Game;