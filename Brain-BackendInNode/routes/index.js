var express = require('express')
var app = express()
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.send('Welcome Admin!');
})
app.get('/*', function (req, res) {
    res.send("<h1>404 | Page Not Found<\/h1>")
})

module.exports = app;