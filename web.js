var express = require('express'),
    cors = require('cors'),
    app = express();

var mongojs = require('mongojs');
var connectionString = process.env.MONGOLAB_URI;

app.use(cors());
app.use(express.bodyParser());
app.set('port', (process.env.PORT || 3000));

var databaseArrays = [
    "questions"
];

var db = mongojs(connectionString, databaseArrays);

/* Questions Retrieval */
app.get('/questions', function(req, res) {
  res.contentType('application/json');
  var fbId = req.param('facebookId');
  var list = [];
  if (fbId) {
    db.questions.find(function (err, docs) {
      console.log(docs);
      for (var visible in docs.visibleTo) {
        if (docs.visibleTo.hasOwnProperty(visible)) {
          if (docs[visible].visibleTo == fbId) {
            list.push(docs[visible]);

          }
        }
      }
      res.send(list);
    });
  } else {
    db.questions.find({visibleTo: null}, function(err, docs) {
      res.send(docs);
    });
  }
});

app.get('/questions/vote', function (req, res) {
  var qId = req.param('questionId');
  var fbId = req.param('facebookId');
  var userType = req.param('userType');
  var isUpVote = req.param('isUpVote');
});

app.post('/questions/new', function(req, res) {
    console.log("Received request for new question");
    var isPublic = req.body.facebookId;

    db.questions.save(req.body);

    res.json(req.body);
});

var server = app.listen(app.get('port'), function() {
    console.log('Listening on port %d', server.address().port);
});
