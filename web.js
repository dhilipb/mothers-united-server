var express = require('express'),
  cors = require('cors'),
  app = express();

var mongojs = require('mongojs');
var connectionString = process.env.MONGOLAB_URI;
var gcm = require('android-gcm');

// initialize new androidGcm object
var gcmObject = new gcm.AndroidGcm('AIzaSyCIbtc12KfmDXCKdkLeNgfsAI6z8KT5aYM');


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
      $or: [{
        visibleFacebookIds: []
      }, {
        visibleFacebookIds: null
      }]
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

  var fbIds = req.body.visibleFacebookIds;
  if (fbIds) {
    for (var id in fbIds) {
      if (fbIds.hasOwnProperty(id)) {
        if (req.body.creatorId === fbIds[id]) {
          fbIds.splice(id, 1);
        }
      }
    }

    for (id in fbIds) {
      db.pushNotifications.find({
        facebookId: fbIds[id]
      }, function(err, docs) {
        if (!docs) {
          return;
        }

        if (docs[0].deviceId) {
          var message = new gcm.Message({
            registration_ids: docs[0].deviceId,
            data: {
              key1: 'key 1',
              key2: 'key 2'
            }
          });

          // send the message
          console.log("Message being sent: ", message);
          gcmObject.send(message, function(err, response) {
            console.log("Response: ", response);
            console.log("Err: ", err);
          });
        }
      });
    }
  }
});

// Comments
app.post('/comments/new', function(req, res) {
  console.log(req.body);
  db.comments.save(req.body);
  res.send(req.body);
});

app.get('/comments', function(req, res) {
  var qId = req.param('questionId');

  db.comments.find({
    questionId: qId
  }, function(err, docs) {
    res.send(docs);
  });
});

app.post('/push/new', function(req, res) {
  db.pushNotifications.save(req.body);
  res.send(req.body);
});

var server = app.listen(app.get('port'), function() {
  console.log('Listening on port %d', server.address().port);
});
