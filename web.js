var express = require('express')
, cors = require('cors')
, app = express();

app.use(cors());
app.use(express.bodyParser());
app.set('port', (process.env.PORT || 3000));

var publicQuestions = [];
var privateQuestions = [];

/* Question object mockup
{
	id: "some id",
	isPublic: true,
	title: "Title",
	fbId: "123141",
	time: "epoch or wathever",
	name: "Mommy",
	pregnancyMonth: 6
}
*/

/* user mock
{
	name: "user name",
	id: some id
	type: "doc"
}
*/

var testObj = {
	id: 1,
	isPublic: true,
	title: "Title",
	fbId: "123141",
	time: "epoch or wathever",
	name: "Mommy",
	pregnancyMonth: 6
};

var testObj2 = {
	id: 2,
	isPublic: false,
	title: "New Title",
	fbId: "123141",
	time: "epoch or wathever",
	name: "Mommy",
	pregnancyMonth: 6
};

addQuestion(testObj, 1);
addQuestion(testObj2, 1);



/* Questions Retrieval */
app.get('/getPublicQuestions', function(req, res) {
	res.contentType('application/json');
	res.send(JSON.stringify(returnQuestionList(1)));
});

app.get('/getPrivateQuestions', function(req, res) {

});

app.get('/returnYesIds', function (req, res) {

});

app.get('/returnNoIds', function (req, res) {

});

/* Setter functions */
function addQuestion(question, status) {
	if (status) {
		publicQuestions.push(question);
	} else {
		privateQuestions.push(question);
	}
}

/* Getter functons */
function returnQuestionList(status) {
	if (status) {
		return publicQuestions;
	} else {
		return privateQuestions;
	}
}



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
