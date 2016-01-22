var Deck = require( "./deck" );
var Player = require( "./player" );
var deckData = require( "../data/cards" );

var defaults = {
  title : "Splendid Game",
  rubies : 6,
  sapphires : 6,
  emeralds : 6,
  diamonds : 6,
  chocolates : 6,
  gold : 6
}

function mergeDefaults( options ) {
  for ( var key in defaults ) {
    if ( options[key] === undefined ) options[key] = defaults[key];
  }

  return options;
}

function Game( options ) {

  defaults = mergeDefaults( options );

  this.title = defaults.title;
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
  this.state.drawPiles.ruby = defaults.rubies;
  this.state.drawPiles.sapphire = defaults.sapphires;
  this.state.drawPiles.emerald = defaults.emeralds;
  this.state.drawPiles.diamond = defaults.diamonds;
  this.state.drawPiles.chocolate = defaults.chocolates;
  this.state.drawPiles.gold = defaults.gold;

  var nobleDeck = new Deck( deckData.nobles );
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

  if ( turn.tier === undefined || turn.tier > 3 || turn.tier < 1 ) {
    throw new Error( "Tried to reserve from an unknown tier" );
  }

  this.players[ turn.player ].reserveCard( this.getDeck( turn.tier ).draw() );
  this.players[ turn.player ].addGems( "gold", 1 )

}

Game.prototype.actBuyReserve = function( turn ) {

  if ( this.players[ turn.player ].reserves === undefined ) {
    throw new Error( "You have not reserved any cards" );
  } else if ( turn.slot === undefined || turn.slot > this.players[ turn.player ].reserves.length - 1 ) {
    throw new Error( "Tried to purchase a reserved card from an unknown slot" );
  }

  var card = this.players[ turn.player ].reserves[ turn.slot ];
  if ( card === undefined ) {
    throw new Error( "There's no card in that slot" );
  }

  for ( var gem in card.cost ) {
    if ( this.players[ turn.player ].getGems( gem ) < card.cost[ gem ] ) {
      throw new Error( "You can't afford that card" );
    }
  }

  for ( var gem in card.cost ) {
    var gemDiff = this.players[ turn.player ].takeGems( gem, card.cost[ gem ] );
    for ( var gem in gemDiff ) {
      this.state.drawPiles[ gem ] += gemDiff[ gem ];
    }
  }
  this.players[ turn.player ].addCard( card );

}

Game.prototype.actBuy = function( turn ) {

  if ( turn.tier === undefined || turn.tier > 3 || turn.tier < 1 ) {
    throw new Error( "Tried to buy from an unknown tier" );
  } else if ( turn.slot === undefined || turn.slot < 0 || turn.slot > 3 ) {
    throw new Error( "Tried to buy from an unknown slot" );
  }

  var card = this.getCardInSlot( turn.tier, turn.slot );
  if ( card === undefined ) {
    throw new Error( "There's no card in that slot" );
  }

  for ( var gem in card.cost ) {
    if ( this.players[ turn.player ].getGems( gem ) < card.cost[ gem ] ) {
      throw new Error( "You can't afford that card" );
    }
  }

  for ( var gem in card.cost ) {
    var gemDiff = this.players[ turn.player ].takeGems( gem, card.cost[ gem ] );
    for ( var gem in gemDiff ) {
      this.state.drawPiles[ gem ] += gemDiff[ gem ];
    }
  }
  this.players[ turn.player ].addCard( card );

  this.replaceSlot( turn.tier, turn.slot );

}

Game.prototype.connectPlayer = function( user ) {
  if ( this.players && this.players.length >= 4 ) {
    throw new Error( "Game is full" );
  }

  this.players = this.players || [];
  this.players.push( new Player( user ) );
}

Game.prototype.getDeck = function( tier ) {
  if ( this.state.decks === undefined ) return undefined;

  return this.state.decks[ tier - 1 ];
}

Game.prototype.getCardInSlot = function( tier, slot ) {
  if ( this.state.grid[ tier - 1 ] === undefined ) return undefined;

  return this.state.grid[ tier - 1 ][slot];
}

Game.prototype.replaceSlot = function( tier, slot ) {
  this.state.grid[ tier - 1 ].splice( slot, 1 );

  // draw a new card
  var deckToDraw = this.getDeck( tier );
  if ( deckToDraw !== undefined ) this.state.grid[ tier - 1 ].push( deckToDraw.draw() );
}

Game.prototype.checkState = function() {

  var game = this;

  // check for nobles
  if ( game.state.nobles ) {
    game.state.nobles.forEach( function( noble, nobleIdx ) {
      if ( noble === undefined ) return;

      for ( var gem in noble.cost ) {
        if ( game.players[ game.currentPlayer ].getGems( gem ) < noble.cost[ gem ] ) {
          return
        }
      }

      game.players[ game.currentPlayer ].addCard( noble );
      game.state.nobles.splice( nobleIdx, 1 );
    });
  }

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
  "buyreserve" : Game.prototype.actBuyReserve,
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