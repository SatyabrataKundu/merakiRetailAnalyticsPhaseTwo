var schedule = require("node-schedule");
var config = require("config");
var Request = require("request");
const debug = require("debug");
var fs = require('fs');

var imageJob = function ImageDetectionJob() {
    schedule.scheduleJob(config.get("environment.constants.snapshotTimer"), function () {
        var datetime = new Date();
        console.log("Job Running at : ", datetime);
        var getSnapshotImageUrl = config.get("simulator.merakicam.getSnapshotImage");
        Request.head(getSnapshotImageUrl, function(err, res, body){
          console.log('content-type:', res.headers['content-type']);
          console.log('content-length:', res.headers['content-length']);
      
          Request(getSnapshotImageUrl).pipe(fs.createWriteStream("image-snapshot.jpg")).on('close', function(){
            console.log("DOWNLOAD DONE.")
          });
        });
    });
}

module.exports.snapshotApi = imageJob;