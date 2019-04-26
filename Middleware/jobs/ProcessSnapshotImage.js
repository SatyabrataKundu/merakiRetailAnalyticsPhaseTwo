var schedule = require("node-schedule");
var config = require("config");
var Request = require("request");
var fs = require('fs');
var promise = require("bluebird");

// Use child_process.spawn method from  
// child_process module and assign it 
// to variable spawn 
var spawn = require("child_process").spawn;


var imageJob = function ImageDetectionJob() {
  schedule.scheduleJob(config.get("environment.constants.snapshotTimer"), function () {
    var datetime = new Date();
    console.log("Job Running at : ", datetime);
    var getSnapshotImageUrl = config.get("simulator.merakicam.getSnapshotImage");
    Request.head(getSnapshotImageUrl, function (err, res, body) {
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);
      Request(getSnapshotImageUrl).pipe(fs.createWriteStream("image-snapshot.jpg")).on('close', function () {
        console.log("DOWNLOAD DONE.")

         //POST call to scanning api method to perform logic and db insertion.
         _callPythonImageProcessing().then(function (result) {
          console.log("RESULT OF PROMISE ",result);
      });


      });
    });
  });

}

  
function _callPythonImageProcessing(){
  return new Promise(function (fulfill, reject) {
    console.log('Inside promise');
    var process = spawn('python',["./../gun detection python/TensorFlow/models/research/object_detection/Object_detection_image.py.py", "./image-snapshot.jpg"] ); 
    if(process === undefined){
      let err = {}
      err.message = 'Process is undefined';
      reject(err);
    }
    let returnData = {};
    returnData.isGunDetected = "true";
    fulfill(returnData);
    process.stdout.on('data', function(data) { 
      console.log('---------------------DATA----------------------------',data.toString());
  } ) 
 });
}


module.exports.snapshotApi = imageJob;