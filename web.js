var express = require('express'),
    cors = require('cors'),
    app = express();

var mongojs = require('mongojs');
var connectionString = process.env.MONGOLAB_URI;

app.use(cors());
app.use(express.bodyParser());
app.set('port', (process.env.PORT || 3000));

var databaseArrays = [
    "questions",
    "comments",
    "pushNotifications"
];

var db = mongojs(connectionString, databaseArrays);

/* Questions Retrieval */
app.get('/questions', function(req, res) {
    res.contentType('application/json');
    var fbId = req.param('facebookId');
    var list = [];
    if (fbId) {
        db.questions.find(function(err, questions) {
            for (var question in questions) {
                if (questions.hasOwnProperty(question)) {
                    for (var item in questions[question].visibleFacebookIds) {
                        if (questions[question].visibleFacebookIds.hasOwnProperty(item)) {
                            if (questions[question].visibleFacebookIds[item] == fbId) {
                                list.push(questions[item]);
                            }
                        }
                    }
                }
            }
            res.send(list);
        });
    } else {
        db.questions.find({
            $or : [
              {visibleFacebookIds: []},
              {visibleFacebookIds: null}
            ]
        }, function(err, docs) {
            res.send(docs);
        });
    }
});

app.post('/questions/vote', function(req, res) {
    var qId = req.param('questionId');
    var fbId = req.param('facebookId');
    var userType = req.param('userType');
    var isUpVote = req.param('isUpVote');
    var object = {
        id: fbId,
        userType: userType
    };

    if (isUpVote) {
        db.questions.update({
            _id: mongojs.ObjectId(qId)
        }, {
            $push: {
                upvotes: object
            }
        });
    } else {
        db.questions.update({
            _id: mongojs.ObjectId(qId)
        }, {
            $push: {
                downvotes: object
            }
        });
    }
});

app.post('/questions/new', function(req, res) {
    console.log("Received request for new question");
    var isPublic = req.body.facebookId;

    db.questions.save(req.body);

    res.json(req.body);
});

// Comments
app.post('/comments/new', function (req, res) {
  var qId = req.param('questionId');
  var fbId = req.param('facebookId');
  var time = req.param('time');
  var com = req.body.comment;

  var comment = {
    qId: qId,
    fbId: fbId,
    time: time,
    comment: com
  };

  db.comments.save(comment);
  res.send(comment);
});

app.get('/comments', function (req, res) {
  var qId = req.param('questionId');

  db.comments.find({
    _id: mongojs.ObjectId(qId)
  }, function (err, docs) {
    res.send(docs);
  });
});

app.post('/push/new', function (req, res) {
  var qId = req.param('questionId');
  var deviceId = req.param('deviceId');

  var push = {
    qId: qId,
    devideId: deviceId
  };

  db.pushNotifications.save(push);
  res.send(push);
});

var server = app.listen(app.get('port'), function() {
    console.log('Listening on port %d', server.address().port);
});
