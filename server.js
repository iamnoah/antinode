/**
 * Simple webserver with logging. By default, serves whatever files are
 * reachable from the directory where node is running.
 */
var fs = require('fs'),
antinode = require('./lib/antinode'),
Script = process.binding('evals').Script,
sys = require('sys');

fs.readFile(process.argv[2] || './settings.json', function(err, data) {
    var settings = {};
    if (err) {
        sys.puts('No settings.json found. Using default settings');
    }
    try {
        settings = JSON.parse(data.toString('utf8',0,data.length));
    } catch (e) {
        sys.puts('Error parsing settings.json: '+e);
        process.exit(1);
    }
    // load custom handlers, if they exist
    var handlers = settings.custom_handlers, handler;
    if(handlers) {
        settings.custom_handlers = [];
        for(var i in handlers) {
            handler = { handle: function() {} };
            Script.runInNewContext( fs.readFileSync(handlers[i]),
                handler, handlers[i] )
            settings.custom_handlers.push( handler );
        }
    }
    antinode.start(settings);
});
