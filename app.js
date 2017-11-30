
/**
	* Node.js Login Boilerplate
	* More Info : http://kitchen.braitsch.io/building-a-login-system-in-node-js-and-mongodb/
	* Copyright (c) 2013-2016 Stephen Braitsch
**/

var http = require('http');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo')(session);
//var asyncLoop =   require('node-async-loop');
var mongoose    =    require('mongoose');
var path =     require('path');
var cors = require('cors'); 
//var convertTime = require('convert-time');
var http = require('http');
//var S = require('string');
var session = require('express-session');

var cookieParser = require('cookie-parser');
//var geocoder = require('geocoder');

	var json = require('json');
	//var S = require('string');
	var Client = require('node-rest-client').Client;
	var NodeGeocoder = require('node-geocoder'); 
	
	
//var AM = require('./app/server/modules/account-manager');
var EM = require('./app/server/modules/email-dispatcher');
var router = express.Router(); 
var app = express();

app.locals.pretty = true;
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/app/server/views');

var engines= require('consolidate');
app.engine('jade',engines.jade);
app.engine('ejs',engines.ejs);
app.set('view engine', 'jade');
//app.set('view engine', 'ejs');
/*
app.set('views',__dirname +'/views');
app.set('view engine', 'ejs');

app.set('views', __dirname + '/app/server/views');
app.set('view engine', 'jade');
*/

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('stylus').middleware({ src: __dirname + '/app/public' }));
app.use(express.static(__dirname + '/app/public'));

// build mongo database connection url //

var dbHost = process.env.DB_HOST || 'localhost'
var dbPort = process.env.DB_PORT || 27017;
var dbName = process.env.DB_NAME || 'node-login';

var dbURL = 'mongodb://'+dbHost+':'+dbPort+'/'+dbName;
if (app.get('env') == 'live'){
// prepend url with authentication credentials // 
	dbURL = 'mongodb://'+process.env.DB_USER+':'+process.env.DB_PASS+'@'+dbHost+':'+dbPort+'/'+dbName;
}



const MongoClient = require('mongodb').MongoClient;

const MONGO_URL = 'mongodb://admin:admin@ds119345.mlab.com:19345/easeyourday';



//var filmg = require('./models/genre');
mongoose.connect('mongodb://localhost/bookstore', { useMongoClient: true });

var movieSchema=new mongoose.Schema({
	name:String,
	address:String,
	location:String,
	shows:{mname:String,timings:[Number]}
}); 

var zomschema= new mongoose.Schema({
	_id: String,
	name:String,
	location:{address:String,locality:String},
	cuisines:String,
	average_cost_for_two:Number,
	user_rating:{aggregate_rating:String,rating_text:String}

});
//dbconnect
var zomcon=mongoose.model('restaurants',zomschema,'restaurants'); 
var user=mongoose.model('moviedb',movieSchema,'moviedb');

var ss="mongodb://localhost/bookstore"; // yaha pe db ka naam aaega
var db   = mongoose.connection;

	app.get('/ttt', function(req, res, next) {
  //res.json({ message: 'Hello World' });
  res.render('Ash1', {data: "ABC"});
});
  
	app.get('/new',function(req,res){
		/////////////////////////////
var startTime=req.param('starttime');
		//var st=startTime;
		
		var EndTime= req.param('endtime');
		var dur = req.param('dur');
		var dest=req.param('destloc');
		
		console.log('Start'+startTime);
	//	console.log('End'+EndTime);
		console.log('duration: '+dur);
		
		var reshh  = startTime.replace(/:/g, "."); 
		//console.log("ST"+startTime);		
		console.log("dot wala start Time"+reshh);
		
		
		if(dur.includes("hour")== true && dur.includes("mins")== true)
		{
				ddq = dur.trim();
			var lng = ddq.length;
			console.log("Lenght :"+lng);
			if(lng == 13)
			{
			var h1 = dur.substring(0, 1);
			h1= h1.trim();
			//console.log("h1"+h1);
			var h2 = dur.substring(7, 8);
			h2 = h2.trim();
			//console.log("h2"+h2);
			var cojj = h1+":"+h2;
			console.log("fisrtcojj:"+cojj);
			}
			else if(lng == 14)
			{
			var h1 = dur.substring(0, 1);
			h1= h1.trim();
			//console.log("h1"+h1);
			var h2 = dur.substring(7, 9);
			h2 = h2.trim();
			//console.log("h2"+h2);
			var cojj = h1+":"+h2;
			console.log("fisrtcojj:"+cojj);
			}
			else
			{
				
			}
			
		}
	 else if (dur.includes("mins")== true)
		{
			//console.log("1");
			var resssh = dur.substring(0, 2);
			console.log(resssh);
			resssh = resssh.trim();
			var lnt = resssh.length;
			//console.log("Lenght Dur"+lnt);
			if(lnt == 1)
			{
				var cojj = "00:0"+resssh;
							console.log("cojj1: "+cojj);
			}
			else if(lnt == 2)
			{
				var cojj = "00:"+resssh
				console.log("cojj2: "+cojj);
			}	
			
		}
		
		console.log("cojj"+cojj);
		
		var time=startTime;
		//console.log("time assssssssssssss"+time);
		var timer1=time.split(':');
		var hours1=parseInt(timer1[0]);
		var min1=parseInt(timer1[1]);
		var time2=cojj;
		var timer2=time2.split(':');
		var hours2=parseInt(timer2[0]);
		var min2=parseInt(timer2[1]);
		console.log(hours1);
		console.log(min1);
		console.log(hours2);
		console.log(min2);
		var mincal=min1+min2;
		var hoursf=((hours1+hours2)%24);
		var minf=((min1+min2)%60);
		console.log("CALCUL"+hoursf);
		console.log("CALCUL"+minf);
		
		if(mincal>=60)
		{
			hoursf=hoursf+1;
			
			
		}
		console.log("Time is "+hoursf+":"+minf);
		var timefinal=hoursf+"."+minf;
		var timefinalint=parseFloat(timefinal);
		var timefianlwithextra = timefinalint + 0.15;
		var timefianlwithextra1 = parseFloat(timefianlwithextra);
		//var timefinalint = +timefinal;
		console.log("timefinalint"+timefinalint);
		console.log("timefianlwithextra1"+timefianlwithextra1);
		

///////////////////////////////////		
var rr=dest.replace(/,/g, " ");
console.log("see this"+rr); 		
var stringArray = rr.split(" ");

var destt=stringArray[0];
console.log("seeee"+destt);



            
	 user.aggregate([{$match:{"location":destt}},{"$addFields": {"shows": {"$map": {"input": "$shows","as": "resultm","in": {"name": "$$resultm.name","mname": "$$resultm.mname","timings": {"$filter": {"input": "$$resultm.timings","as": "resultf","cond": {"$gte": ["$$resultf",timefianlwithextra1]}}}}}}}}], function(err, result){
		 //user.find({"location":"vashi"}
		 //Main function
		user.find({"location":"vashi"});
	
		
			var d =[];
		 var v = result.length;
		 console.log(" val:"+v);
	//
		 for(var i =0;i<v;i++)
			{
				var v2 = result[i].shows.length;
			
				//console.log("value of v2:"+v2);
				for(var j =0;j<v2;j++)
				{	
					var mm = result[i].shows[j].mname;
					//console.log("value of mm:"+mm);
					var v3 = result[i].shows[j].timings.length;
					//console.log(v3);
					for(var k =0;k<v3;k++)
					{
					var extra = parseInt("00");
					result[i].shows[j].timings[k] = convertTime(result[i].shows[j].timings[k]+":"+extra);
				
					}
				}
				
			}
		
	 res.render('pages/index.ejs', {
					result: result
					
					});
				
	}); 
		
	});
	
	//asavari zomato
	
		var options = {
	  provider: "google",
	  // Optional depending on the providers
	  httpAdapter: "https", // Default
	  apiKey: "AIzaSyDy2hsaaaBJcvZyLm4p31PAJZfql4Tf8TI" // for Mapquest, OpenCage, Google Premier
			 // 'gpx', 'string', ...
	};
	  
		app.get('/food', function(req1, res1) {
			var dest=req1.param('destloc');
			console.log(dest);
		var rr=dest.replace(/,/g, " ");
	console.log("see this"+rr); 		
	var stringArray = rr.split(" ");

	var destt=stringArray[0];
	console.log("seeee"+destt);
	
	var geocoder = NodeGeocoder(options);
	// Using callback..To convert address to latitude & logitude
	geocoder.geocode(destt, function(err, res) {
		console.log(res);
	  var g = JSON.stringify(res);
	  var pas = JSON.parse(g);
	  var latval = pas[0].latitude;
	  var longval = pas[0].longitude;
	console.log("Latitude:"+pas[0].latitude);
	console.log("Longitude:"+pas[0].longitude);
	var client = new Client();	 
	 var args = {
	 
		headers: { "Content-Type": "application/json" , "user-key": "ec4adab35ac2491e310ea88e21e121e0" }
	};
		client.get("https://developers.zomato.com/api/v2.1/geocode?lat="+latval+"&lon="+longval+"",args, function (data, response) {
			
			console.log(
	/* define stringify */
	JSON.stringify(data)

	);
	
	  var key, count = 0;
		for(key in data.location) {
			if(data.location.hasOwnProperty(key)) {
				count++;
	}

	}
	//console.log(JSON.stringify(data[0].address));
	console.log("Count2"+count);
	var data = data
	// console.log(data);
				var tagline = "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else.";
	res1.render('pages/food.ejs', {
		data : data
	});
		
	});//;res.render('Ash1', {data: "ABC"});
	
	});
 
	});

	
//zomatorecommend
app.get('/makemehappy', function(req1, res1) {
			
  var lat=req1.param('lat');
  var lng=req1.param('lng');
		console.log(lat);
console.log(lng);	

	 var count=50;
	  var r=5000;
	  var cuisine=25;
	  var sort="real_distance";
	  var order="asc";

	var client = new Client();	 
	 var args = {
	 
		headers: { "Content-Type": "application/json" , "user-key": "ec4adab35ac2491e310ea88e21e121e0" }
	};
		client.get("https://developers.zomato.com/api/v2.1/search?count="+count+"&lat="+lat+"&lon="+lng+"&radius="+r+"&cuisines="+cuisine+"&sort="+sort+"&order="+order+"",args, function (data, response) {
		
	
	  var key, count = 0;
		for(key in data.location) {
			if(data.location.hasOwnProperty(key)) {
				count++;
				}
	}
	console.log("Count2"+count);
	
	var data = data;
			var tagline = "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else.";
	res1.render('pages/makemehappy.ejs', {
		data : data
	});
		
	});
	
	});	

	//recommendwithdb
	/*app.get('/makemehappy',function(req,res2)

	{
		zomcon.find({$or:[{"user_rating.rating_text":"Good"},{"user_rating.rating_text":"Average"}],$and:[{"cuisines":"Chinese"}]},{"name":1,"location.address":1,"user_rating.rating_text":1,"cuisines":1},function(err,resq)
		
		{
		//console.log(resq);
		 var tt=JSON.stringify(resq);
		 res2.render('pages/makemehappy', {
					tt:tt
					
					});
		
		});	
		
		
});
	*/
	
	//myprofile
app.get('/profile',function(req,res)
{
	res.send('please use /api/books or /api/genres okay ? ');
	var genre1= req.param('genre1');
	var genre2= req.param('genre2');
	var genre3= req.param('genre3');
	var genre4= req.param('genre4');
	var genre5= req.param('genre5');
	var genre6= req.param('genre6');
	var genre7= req.param('genre7');
	var genre8= req.param('genre8');
	var genre9= req.param('genre9');
	var genre10= req.param('genre10');
	var name= req.param('name');
	console.log(name);
	var food1= req.param('food1');
	var food2= req.param('food2');
	var food3= req.param('food3');
	var food4= req.param('food4');
	var food5= req.param('food5');
	//console.log(food1);
	//console.log(food2);
	
	  MongoClient.connect(MONGO_URL, (err, db) => {  
  if (err) {
    return console.log(err);
  }
 
		 db.collection('profile').update(
		 
    
		{name:name},
		
		{$set: {name:name,
			
	  genre1:genre1,
	  genre2:genre2,
	  genre3:genre3,
	  genre4:genre4,
	  genre5:genre5,
	  genre6:genre6,
	  genre7:genre7,
	  genre8:genre8,
	    genre9:genre9,
	  genre10:genre10,
	  food1:food1,
	  food2:food2,
		food3:food3,
		food4:food4,
		food5:food5
		}},
    function (err, res) {
      if (err) {
        db.close();
        return console.log(err);
      }
      // Success
      db.close();
    },{upsert:true}
  )
	  });
	
	
	
});




app.use(session({
	secret: 'faeb4453e5d14fe6f6d04637f78077c76c73d1b4',
	proxy: true,
	resave: true,
	saveUninitialized: true,
	store: new MongoStore({ url: dbURL })
	})
);

require('./app/server/routes')(app);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
