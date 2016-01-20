function Deck( cardList ) {

  // draw cards
  this.cards = JSON.parse( cardList );
  this.shuffle();

}

Deck.prototype.shuffle = function() {

  for ( var temp, i, j = this.cards.length; i; --i ) {

    j = Math.floor( Math.random() * i );
    temp = this.cards[i];
    this.cards[i] = this.cards[j];
    this.cards[j] = temp;

  }

}

Deck.prototype.draw = function() {

  if ( this.cards.length === 0 ) return null;
  return this.cards.pop();

}

module.exports = Deck;