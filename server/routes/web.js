//Imports modules
var express = require('express'),
    router = express.Router(),
    path = require('path'),
    request = require('request'),
    http = require('http'),
    q = require('q');

//Gets the index page path
var indexPath = path.join(__dirname, '../../app');

//Route to handle index page, sending the html
router.get('/', function (req, res, next) {
    res.sendFile(indexPath + '/index.html');
});

//Returns the video list
router.get('/videos', function (req, res, next) {
    //Handling the request, with promise
    promisedRequest('http://pbmedia.pepblast.com/pz_challenge/assets.json')
        .then(function (response) { 
            //Promise resolved
            res.send(response);

        }, function (error) { 
            //Promise rejected
            console.log(error);
        });
});

//Returns a specific video, based on the name parameter
router.get('/videoByName/:name', function (req, res, next) {
    promisedRequest('http://pbmedia.pepblast.com/pz_challenge/assets.json')
        .then(function (response) {
            //Gets the param
            var name = req.params.name;
            //Parsing the response into JSON          
            var videos = JSON.parse(response);
            //Getting the specific node that we need
            videos = videos.objects;

            //Getting the specific video
            var video = returnVideoByName(videos, name);

            //Sends the video object
            res.send(video);

        }, function (error) {
            console.log(error);
        });
});

//Iterate the videos list and returns a specific one based on the name parameter
function returnVideoByName(videos, name){
    var video = '';

    for(var i = 0; i < videos.length; i++) {
        if (videos[i].name == name) {
            video = videos[i];
            break;
        }
    }

    return video;
}

//Return a promise
function promisedRequest(options) {
    //Creates a deferred object from q
    var deferred = q.defer();
    var req = http.request(options, function (response) {
        //Sets the response encoding to parse json string
        response.setEncoding('utf8');
        var responseData = '';

        //Appends data to responseData variable on the 'data' event emission
        response.on('data', function (data) {
            responseData += data;
        });

        //Listens to the 'end' event
        response.on('end', function () {
            //Resolve the deferred object with the response
            deferred.resolve(responseData);
        });
    });

    //Listens to the 'error' event
    req.on('error', function (err) {
        //If an error occurs reject the deferred
        deferred.reject(err);
    });

    req.end();

    //Returning a promise object
    return deferred.promise;
};

module.exports = router;