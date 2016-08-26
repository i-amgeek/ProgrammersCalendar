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
 flag = 0;
app.get('/scrape/codeforces', function(req,res){

	request.get('http://codeforces.com/api/contest.list', function(err, response, body) {
		if (!err && response.statusCode == 200) {
			var locals = JSON.parse(body);
			var data = [];
			for(var i=0;i<20;i++){
				var myObj = {
					status: locals.result[i].phase,
					eventUrl: "http://codeforces.com/enter?back=%2Fcontest%2F" + locals.result[i].id,
					eventName: locals.result[i].name,
					startTime: locals.result[i].startTimeSeconds,
					endtime: locals.result[i].relativeTimeSeconds
				};
				data.push(myObj);
			}
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(data, null, 3));
		}

	});

})
app.get('/scrape/hackerearth', function(req,res){

	request.get('https://www.hackerearth.com/chrome-extension/events/', function(err, response, body) {
		if (!err && response.statusCode == 200) {
			var locals = JSON.parse(body);
			var data = [];
			for(var i=0;i<20;i++){
				var myObj = {
					status: locals.response[i].status,
					eventName: locals.response[i].title,
					eventLink: locals.response[i].url,
					startTime: locals.response[i].start_timestamp,
					endtime: locals.response[i].end_timestamp
				};
				data.push(myObj);
			}
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(data, null, 3));
		}
	});
})

app.get('/scrape/hackerrank', function (req, res) {

	request.get('https://www.hackerrank.com/rest/contests/upcoming?offset=0&limit=10&contest_slug=active&_=', function(err, response, body) {
		if (!err && response.statusCode == 200) {
			var locals = JSON.parse(body);
			var data = [];
			for(var i=0;i<10;i++){
				var myObj = {
					status: locals.models[i].started,
					eventName: locals.models[i].name,
					eventLink: "https://www.hackerrank.com/contests",
					startTime: locals.models[i].get_starttimeiso,
					endtime: locals.models[i].get_endtimeiso
				};
				data.push(myObj);
			}
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(data, null, 3));
		}
	});

})

app.get('/scrape/topcoder', function (req, res) {
	request.get('https://clients6.google.com/calendar/v3/calendars/appirio.com_bhga3musitat85mhdrng9035jg@group' +
		'.calendar.google.com/events?calendarId=appirio.com_bhga3musitat85mhdrng9035jg%40group.calendar.google.' +
		'com&singleEvents=true&timeZone=Asia%2FCalcutta&maxAttendees=1&maxResults=250&sanitizeHtml=true&timeMin=' +
		'2016-07-10T00%3A00%3A00-04%3A00&key=AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs', function(err, response, body) {
		if (!err && response.statusCode == 200) {
			var locals = JSON.parse(body);
			var data = [];
			for(var i=0;i<10;i++){
				var myObj = {
					status: locals.items[i].status,
					eventName: locals.items[i].summary,
					eventLink: locals.items[i].htmlLink,
					startTime: locals.items[i].start.dateTime,
					endtime: locals.items[i].end.dateTime
				};
				data.push(myObj);
			}
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(data, null, 3));
		}
	});
})

app.get('/*', function (req, res) {
    res.send("<h1>404 | Page Not Found<\/h1>")
})

module.exports = app;