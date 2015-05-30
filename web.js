var express = require('express')
, cors = require('cors')
, app = express();

app.use(cors());
app.use(express.bodyParser());
app.set('port', (process.env.PORT || 3000));

app.get('/getName', function(req, res){
	console.log("Received request");
	var repsonseJson = {
		"http://www.google.com":{"name":"FirstCandidate"},
		"http://www.facebook.com":{"name":"SecondCandidate"},
		"http://www.twitter.com":{"name":"ThirdCandidate"}
	};
	res.json(repsonseJson);
});

app.get('/getData', function(req, res){
	console.log("Received request");
	var repsonseJson = {
		"Description":"Legend explaining the graph",
		"First value":1000,
		"Second value":2000,
		"Third value":3000,
		"Forth value":4000,
		"Fifth value":5000
	};
	res.json(repsonseJson);
});


var server = app.listen(app.get('port'), function() {
    console.log('Listening on port %d', server.address().port);
});

app.get('/testGet', function(req, res){
	console.log("Received request for testGet");
	res.send("testGet Successful");
});

app.post('/testPost', function(req, res){
	console.log("Received request for testPost");
	var responseString = req.body.city + " is the capital of " + req.body.country; 
	res.send(responseString);
});

app.get('/testGetJson', function(req, res){
	console.log("Received request for testGetJson");
	var repsonseJson = {
		"FirstCandidate": "http://facebook.com",
		"SecondCandidate": "http://www.facebook.com",
		"ThirdCandidate":"http://www.twitter.com"
	};
	res.json(repsonseJson);
});

app.post('/testPostJson', function(req, res){
	console.log("Received request for testPostJson");
	var city = req.body.city;
	var country = req.body.country; 
	var repsonseJson = {
		city : city,
		country : country,
		continent: "Europe"
	};
	res.json(repsonseJson);
});

var totalVote = 0;
app.post('/vote', function(req, res){
	console.log("Received request for vote");
	var name = req.body.name;
	var newVote = parseInt(req.body.vote); 
	totalVote =  totalVote+newVote;


	var repsonseJson = {
		'name' : name,
		'totalVote' : totalVote
	};
	res.json(repsonseJson);
});