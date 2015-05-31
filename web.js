var express = require('express'),
    cors = require('cors'),
    app = express();

var mongojs = require('mongojs');
var connectionString = process.env.MONGOLAB_URI;
var gcm = require('node-gcm');

// initialize new androidGcm object
// var gcmObject = new gcm.AndroidGcm('AIzaSyCIbtc12KfmDXCKdkLeNgfsAI6z8KT5aYM');


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
    var qId = req.body.questionId;
    var isUpVote = req.body.isUpVote;

    var object = {
        id: req.body.facebookId,
        userType: req.body.userType
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
    console.log("fbIds", fbIds);
    if (fbIds) {
        // for (var id in fbIds) {
        //   if (fbIds.hasOwnProperty(id)) {
        //     if (req.body.creatorId === fbIds[id]) {
        //       fbIds.splice(id, 1);
        //     }
        //   }
        // }

        for (var id in fbIds) {
            console.log("fbIds one by one", fbIds[id]);
            db.pushNotifications.find({
                facebookId: fbIds[id]
            }, function(err, docs) {
                console.log("docs", docs)

                for (var doc in docs) {
                    if (docs[doc].deviceId) {
                        var message = new gcm.Message();

                        message.addData('alert', 'msg1');
                        message.addData('title', 'msg2');

                        var regIds = [];
                        regIds.push(docs[doc].deviceId);

                        var sender = new gcm.Sender('AIzaSyCIbtc12KfmDXCKdkLeNgfsAI6z8KT5aYM');

                        sender.send(message, regIds, function(err, result) {
                            if (err) console.error("Error: ", err);
                            else console.log("Result: ", result);
                        });
                    }
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
