var express = require('express')
var request = require('request')
var cheerio = require('cheerio');

var app = express()
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.send('Welcome Admin!');
})
app.get('/scrape/codechef', function (req, res) {
	//WebScrapper Code Goes Here
	url="https://www.codechef.com/contests";
	request(url, function(error, response, html){
        if(!error){
        	console.log('Scrapping Successful');
            var $ = cheerio.load(html);
            var result = [];
            count = 1;
			$('.dataTable tbody tr td').each(function(i, elem) {
				if(count==1){
					eventCode=$(this).text();
				}else if(count==2){
					eventName=$(this).text();
				}else if(count==3){
					startTime=$(this).text();
				}else if(count==4){
					endTime=$(this).text();
					count=0;
					result.push({eventCode: eventCode, eventName: eventName, startTime: startTime,endTime: endTime});
				};
			  count+=1;
			});
			res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result, null, 3));
        }else{
        	console.log('Error Scraping');
        }
    })

    
})
app.get('/*', function (req, res) {
    res.send("<h1>404 | Page Not Found<\/h1>")
})

module.exports = app;