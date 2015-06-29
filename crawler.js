var express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    fs = require('fs'),
    request = require('request'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    FeedParser = require('feedparser'),
    ogs = require('open-graph-scraper'),
    app = express();
    require("string_score");


var port = process.env.PORT || 8080;
var host = '0.0.0.0';
var ogdata = [];
var router = express.Router();              // get an instance of the express Router

function mergeFeed(feed){
	ogdata.push(feed)
}

function fetch(feed) {
  // Define our streams
  var req = request(feed, {timeout: 10000, pool: false});
  req.setMaxListeners(50);
  // Some feeds do not respond without user-agent and accept headers.
  req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36')
     .setHeader('accept', 'text/html,application/xhtml+xml');

  var feedparser = new FeedParser();

  // Define our handlers
  req.on('error', done);
  req.on('response', function(res) {
    if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
    var charset = getParams(res.headers['content-type'] || '').charset;
    res = maybeTranslate(res, charset);
    // And boom goes the dynamite
    res.pipe(feedparser);
  });

  feedparser.on('error', done);
  feedparser.on('end', done);
  feedparser.on('readable', function() {
    var post;
    while (post = this.read()) {
		var options = {'url':post.origlink,'timeout':2000};
		ogs(options, function(err, results) {
			if (err === null){
			    console.log("err:",err);
			    console.log("results:",results.data);
			    if (ogdata.length > 0){
			    	mergeFeed(results.data)
			    }else{
			    	ogdata.push(results.data);
				}
			}
		});
      	//console.log(post.origlink);
    }
  });
  return ogdata;
}

function maybeTranslate (res, charset) {
  var iconv;
  // Use iconv if its not utf8 already.
  if (!iconv && charset && !/utf-*8/i.test(charset)) {
    try {
      iconv = new Iconv(charset, 'utf-8');
      console.log('Converting from charset %s to utf-8', charset);
      iconv.on('error', done);
      // If we're using iconv, stream will be the output of iconv
      // otherwise it will remain the output of request
      res = res.pipe(iconv);
    } catch(err) {
      res.emit('error', err);
    }
  }
  return res;
}

function getParams(str) {
  var params = str.split(';').reduce(function (params, param) {
    var parts = param.split('=').map(function (part) { return part.trim(); });
    if (parts.length === 2) {
      params[parts[0]] = parts[1];
    }
    return params;
  }, {});
  return params;
}

function done(err) {
  if (err) {
    console.log(err, err.stack);
    return process.exit(1);
  }
}

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.get('/ogdata', function(req, res) {
    res.json(ogdata);
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
fetch("http://rss.cnn.com/rss/cnn_topstories.rss");
fetch("http://feeds.foxnews.com/foxnews/most-popular");
console.log('Magic happens on port ' + port);
