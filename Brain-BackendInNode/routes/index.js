var express = require('express')
var request = require('request')
var cheerio = require('cheerio');
var moment = require('moment-timezone');
moment().tz("Asia/Kolkata").format();

var app = express()

app.get('/', function (req, res) {
			res.setHeader('Content-Type', 'application/json');
			var time = moment ().format("YYYY-MM-DD HH:mm:ss"); 
            res.send(JSON.stringify({"name":"programmersCalendar API","version":"0.5","authors":"vipinKhushu and vipulMaan","time":time}, null, 3));
})
app.get('/scrape/codechef', function (req, res) {
	//WebScrapper Code Goes Here
	time = moment ().format("YYYY-MM-DD HH:mm:ss"); 
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
					if(moment(startTime).isBefore(time)&&moment(endTime).isAfter(moment(time))){
						var status = "live";
					}else if(moment(startTime).isAfter(time)){
						var status = "future";
					}else{
						var status = "past";
					}
					var link = 'https://www.codechef.com/'+eventCode;
					result.push({status:status, eventLink:link, eventName: eventName, startTime: startTime,endTime: endTime});
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