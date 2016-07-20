var connect = require('connect');
var serveStatic = require('serve-static');

var path = require("path");

var contentDir = path.join(__dirname, "../dist");

connect().use(serveStatic(contentDir)).listen(8081, function(){
    console.log('Serving ' + contentDir);
    console.log('Server running on 8081 ...');
});