var express = require('express'),
    cors = require('cors'),
    app = express();

var mongojs = require('mongojs');
var connectionString = process.env.MONGOLAB_URI;

app.use(cors());
app.use(express.bodyParser());
app.set('port', (process.env.PORT || 3000));

var databaseArrays = [
  "publicQuestions",
  "privateQuestions"
];

var db = mongojs(connectionString, databaseArrays);

/* Questions Retrieval */
app.get('/getPublicQuestions', function(req, res) {

    res.contentType('application/json');
    db.publicQuestions.find(function(err, docs) {
    	console.log("Retrieved from DB and sending: ", docs);
    	res.send(docs);
	});
});

app.get('/getPrivateQuestions', function(req, res) {

});

app.get('/returnYesIds', function(req, res) {

});

app.get('/returnNoIds', function(req, res) {

});

app.post('/addPublicQuestion', function(req, res) {
    console.log("Received request for addPublicQuestion");
    var isPublic = req.body.isPublic;
    var pregnancyMonth = parseInt(req.body.pregnancyMonth);
    var title = req.body.title;
    var facebookId = req.body.facebookId;
    var time = req.body.time;
    var name = req.body.name;

    var object = {
      isPublic: isPublic,
      pregnancyMonth: pregnancyMonth,
      title: title,
      facebookId: facebookId,
      time: time,
      name: name
    };

    db.publicQuestions.save(object);
    res.json(object);
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

var server = app.listen(app.get('port'), function() {
    console.log('Listening on port %d', server.address().port);
});