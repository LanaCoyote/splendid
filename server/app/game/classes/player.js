function Player( user ) {

  this.id = user.$id;
  this.gems = {};
  this.hand = [];
  this.reserves = [];

}

Player.prototype.getGems = function( gem ) {

  var total = 0;

  if ( this.gems ) {
    total += this.gems[ gem ] || 0;
    total += this.gems.gold || 0;
  }

  if ( this.hand ) {
    this.hand.forEach( function( card ) {
      if ( card.gem === gem ) total += 1;
    });
  } 

  return total;

}

Player.prototype.getPoints = function() {

  if ( this.hand === undefined ) return 0;

  return this.hand.reduce( function( sum, card ) {
    return sum + ( card.value || 0 );
  }, 0 );

}

Player.prototype.addGems = function( gem, amount ) {

  if ( this.gems && this.gems[ gem ] ) {
    this.gems[ gem ] += amount;
  } else {
    this.gems = this.gems || {};
    this.gems[ gem ] = amount;
  }

}

Player.prototype.addCard = function( card ) {

  if ( card === undefined ) return;
  this.hand = this.hand || [];
  this.hand.push( card );

}

Player.prototype.reserveCard = function( card ) {

  if ( card === undefined ) return;
  this.reserves = this.reserves || [];
  this.reserves.push( card );

}

Player.prototype.takeGems = function( gem, amount ) {

  var gemDiff = {};
  if ( this.hand ) { 
    this.hand.forEach( function( card ) {
      if ( card.gem === gem ) amount -= 1;
    });
  }

  if ( this.gems && this.gems[ gem ] >= amount ) {
    gemDiff[ gem ] = amount;
    this.gems[ gem ] -= amount;
    return gemDiff;
  } else if ( this.gems && this.gems[ gem ] !== undefined ) {
    if ( amount > 0 ) gemDiff[ gem ] = this.gems[ gem ];
    amount -= this.gems[ gem ];
    this.gems[ gem ] = 0;
  }

  if ( amount > 0 ) gemDiff.gold = amount;
  this.gems.gold -= amount;
  if ( this.gems.gold < 0 ) console.error( "WARNING: Player ended up with less than 0 gold" );
  return gemDiff;

}

module.exports = Player;