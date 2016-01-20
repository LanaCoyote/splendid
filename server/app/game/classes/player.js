function Player( user ) {

  this.id = user.$id;
  this.gems = {};
  this.hand = [];
  this.reserves = [];

}

Player.prototype.getGems = function( gem ) {

  var total = this.gems[ gem ] || 0;
  total += this.gems.gold || 0;

  this.hand.forEach( function( card ) {
    if ( card.gem === gem ) total += 1;
  });

  return total;

}

Player.prototype.getPoints = function() {

  return this.hand.reduce( function( sum, card ) {
    return sum + ( card.value || 0 );
  }, 0 );

}

Player.prototype.addGems = function( gem, amount ) {

  if ( this.gems[ gem ] ) {
    this.gems[ gem ] += amount;
  } else {
    this.gems[ gem ] = amount;
  }

}

Player.prototype.addCard = function( card ) {
  this.hand.push( card );
}

Player.prototype.reserveCard = function( card ) {
  this.reserves.push( card );
}

Player.prototype.takeGems = function( gem, amount ) {

  this.hand.forEach( function( card ) {
    if ( card.gem === gem ) amount -= 1;
  });

  if ( this.gems.gold > amount ) {
    this.gems.gold -= amount;
    return;
  } else if ( this.gems.gold !== undefined ) {
    amount -= this.gems.gold;
    this.gems.gold = 0;
  }

  this.gems[ gem ] -= amount;
  if ( this.gems[ gem ] < 0 ) console.error( "WARNING: Player ended up with less than 0 " + gem );

}

module.exports = Player;