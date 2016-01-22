function Deck( cardList ) {

  // draw cards
  this.cards = JSON.parse( cardList );
  this.shuffle();

}

Deck.prototype.shuffle = function() {

  var deck = this.cards.slice();
  for ( var shuffles = 10; shuffles > 0; --shuffles ) {
    for ( var i = deck.length - 1; i > 0; --i ) {

      var swapTarget = Math.floor( Math.random() * i );
      var temp = deck[i];
      deck[i] = deck[swapTarget];
      deck[swapTarget] = temp;

    }
  }
  this.cards = deck;

}

Deck.prototype.draw = function() {

  if ( this.cards.length === 0 ) return null;
  return this.cards.pop();

}

module.exports = Deck;