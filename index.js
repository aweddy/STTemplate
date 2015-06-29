var express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    fs = require('fs'),
    request = require('request'),
    favicon = require('serve-favicon');
    logger = require('morgan');
    app = express();

var port = process.env.PORT || 1337;
var host = '0.0.0.0';

var faviconPath = '/cutup/public/library/img/common/favicon.ico';

// app.use(logger());

var ztatic = process.argv[2] === 'static';
if (ztatic) {
    // Serve up the static version of the site instead of the express version.
    if (fs.existsSync(__dirname + faviconPath)) {
        app.use(favicon(__dirname + faviconPath));
    }
    app.use('/', express.static(__dirname + '/public'));
    app.listen(port, host, function () {
        console.log("Static site listening on host: " + host + " and port: " + port);
    });
}
else {
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
    app.use(bodyParser.json())
    
    app.set('view cache', false);

    if (fs.existsSync(__dirname + faviconPath)) {
        app.use(favicon(__dirname + faviconPath));
    }
    require('./cutup/routes')(app);
    app.use('/', express.static(__dirname + '/cutup/public'));

    var server = app.listen(port, host, function () {
        console.log("Listening on host: " + host + " and port: " + port);

        var crawl = process.argv[2] === 'crawl';
        var outputFolder = path.join(__dirname, "/cutup/public");
        fs.mkdir(outputFolder, function (err) { });
        if (crawl) { 
            crawlApp('localhost', port, server, app, outputFolder);
        }
    });
}

//
// Crawl the app and save the static files.
//
function crawlApp(host, port, server, app, outputFolder) {
    var stack = app._router.stack;
    for (var i in stack) {
        var rt = stack[i];

        if (rt.route) {
            var pth = rt.route.path;
            if (typeof(pth) !== 'string') {
                continue;
            }
            // Hit this path and get the HTML response.
            var url = "http://" + host + ":" + port;
            var name = rt.route.path.replace(/\//, '');
            if (!name) { 
                name = "index"; 
            }
            name += ".html";

            var fileToWrite = path.join(outputFolder, name);
            var fullPath = url + rt.route.path;
            
            // Wrap this in a closure so that the value of the path and filename to write don't change with the next iteration of the loop by the time the HTTP request comes back.
            (function (route, fullPath, fileToWrite) {
                // Save the response to disk.
                console.log("Getting " + fullPath);
                console.log("Output file: " + fileToWrite);

                request.get(fullPath, function (err, res, body) {
                    body = body.replace(/href=['"](\/[a-z\-]+)['"]/gi, 'href=\'$1.html\'');
                    body = body.replace(/href=['"]\/['"]/gi, 'href="/index.html"');

                    fs.writeFile(fileToWrite, body, function (err) {
                        console.log("Wrote ", fileToWrite);
                    });
                });

            })(rt.route, fullPath, fileToWrite);
        }
    }
}
