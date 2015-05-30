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
app.get('/questions', function(req, res) {
  res.contentType('application/json');
  var fbId = req.param('facebookId');
  if (fbId) {
    db.privateQuestions.find(function(err, docs) {
      res.send(docs);
    });
  } else {
    db.publicQuestions.find(function (err, docs) {
      res.send(docs);
    });
  }
});

app.get('/returnYesIds', function(req, res) {
  db.publicQuestions.findOne({
    _id:mongojs.ObjectId(req.param('id'))
  }, function (err, doc) {
    res.send(doc.title);
  });



  // res.send(req.param('id'));
});

app.get('/returnNoIds', function(req, res) {

});

app.post('/questions/new', function(req, res) {
    console.log("Received request for addQuestion");
    var isPublic = req.body.facebookId;

    if (isPublic) {
        db.publicQuestions.save(req.body);
    } else {
        db.privateQuestions.save(req.body);
    }

    res.json(req.body);
});

app.post('/yes', function(req, res) {
    var questionId = req.body.id;
    db.publicQuestions.findOne({
      _id:mongojs.ObjectId(questionId)
    }, function (err, doc) {
      // List of users or count

      doc.users = listOfUsers;
      res.send(doc.users);
    });

    res.json(req.body);
});

app.post('/no', function(req, res) {

});


var server = app.listen(app.get('port'), function() {
    console.log('Listening on port %d', server.address().port);
});
