#!/usr/bin/env node

'use strict';
var connect = require('connect');
var serveStatic = require('serve-static');
var open = require("open");
var path = require("path");

var contentDir = path.join(__dirname, "../dist");

connect().use(serveStatic(contentDir)).listen(8081, function(){
    console.log('Serving ' + contentDir);
    console.log('Server running on 8081 ...');
    open("http://localhost:8081");
});