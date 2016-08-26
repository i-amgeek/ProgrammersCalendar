//Import All Required Node Modules
var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var cheerio = require('cheerio');

//Initialize the express app
var app = express()

//View engine setup
routes=require('./routes');

//Setting up port
app.set('port', (process.env.PORT || 5000))

//Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

//Process application/json
app.use(bodyParser.json())

if (app.get('env') === 'development') {
  app.locals.pretty = true;
}
//Index route
app.get('/', routes)
app.get('/scrape/codechef',routes)
app.get('/scrape/codeforces',routes)
app.get('/scrape/hackerearth',routes)
app.get('/scrape/topcoder',routes)
app.get('/scrape/hackerrank',routes)
app.get('/*', routes)


//Spin up the server
app.listen(app.get('port'), function() {
    console.log('App running on port', app.get('port'))
})