'use strict';
var path = require('path');
var chalk = require('chalk');
var util = require('util');

var rootPath = path.join(__dirname, '../../../');
var indexPath = path.join(rootPath, './browser/views/game-view.html');
var faviconPath = path.join(rootPath, './server/app/views/favicon.ico');

var env = require(path.join(rootPath, './server/env'));

var colorTable = {
    "100" : chalk.blue,
    "200" : chalk.green,
    "300" : chalk.cyan,
    "400" : chalk.magenta,
    "500" : chalk.red
}

function formatStatusCode( sc ) {
    for ( var base in colorTable ) {
        if ( sc - Number( base ) < 100 ) return colorTable[ base ]( sc.toString() );
    }

    return chalk.yellow( sc );
}

var logMiddleware = function (req, res, next) {

    var postfix = "";
    var originalPath = req.path;
    if ( Object.keys( req.query ).length ) postfix += "\n" + chalk.bgBlue( "DATA" ) + " -> QUERY: " + JSON.stringify( req.query );
    if ( Object.keys( req.body ).length ) postfix += "\n" + chalk.bgBlue( "DATA" ) + " -> BODY:  " + JSON.stringify( req.body );
    console.log( chalk.bgBlue( "[EX]" ), chalk.yellow( "INCOMING REQUEST:  " ), req.method, req.path, postfix );

    res.on( "finish", function() {
        console.log( chalk.bgBlue( "[EX]" ), chalk.yellow( "OUTGOING RESPONSE: " ), req.method, originalPath, formatStatusCode( res.statusCode ) );
    })

    next();

};

module.exports = function (app) {
    app.setValue('env', env);
    app.setValue('projectRoot', rootPath);
    app.setValue('indexHTMLPath', indexPath);
    app.setValue('faviconPath', faviconPath);
    app.setValue('log', logMiddleware);
};
