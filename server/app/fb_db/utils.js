module.exports = {

  fbArrayToArray : function( fbArray ) {

    var newArray = [];

    for ( var id in fbArray ) {
      fbArray[id].$id = id;
      newArray.push( fbArray[id] );
    }

    return newArray;

  }

}