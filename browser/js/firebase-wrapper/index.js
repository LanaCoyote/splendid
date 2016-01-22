var fbwrapper = angular.module( "FirebaseWrapper", ["firebase"] );

fbwrapper.constant( "FB_URI", "https://incandescent-heat-6265.firebaseio.com/" );

fbwrapper.run( function( $rootScope, FireFactory, FB_URI ) {

  if ( !FB_URI ) {
    console.error( "Firebase URI is not configured." )
  }

  var rootRef = new Firebase( FB_URI );
  FireFactory.setRootRef( rootRef );

});

fbwrapper.factory( "FireFactory", function( $firebaseObject, $firebaseArray ) {

  var FireFactory = {};
  var rootRef = null;

  FireFactory.setRootRef = function( ref ) {
    rootRef = ref;
  }

  FireFactory.getPath = function( path ) {

    var ref = rootRef;
    path.split( '/' ).forEach( function( pchunk ) {
      ref = ref.child( pchunk );
    })

    ref.fetch = function() {
      return $firebaseObject( this );
    }

    ref.fetchChild = function( path ) {
      return $firebaseObject( this.child( path ));
    }

    ref.fetchChildArray = function( path ) {
      return $firebaseArray( this.child( path ));
    }

    return ref;
    
  }

  FireFactory.getPathObject = function( path ) {
    return FireFactory.getPath( path ).fetch();
  }

  return FireFactory;

});