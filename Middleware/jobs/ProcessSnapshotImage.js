var schedule = require("node-schedule");
var config = require("config");
var Request = require("request");
var fs = require('fs');
var promise = require("bluebird");
var sys   = require('sys');
// Use child_process.spawn method from  
// child_process module and assign it 
// to variable spawn 
const { spawn } = require('child_process');


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
         runPy.then(function(fromRunpy) {
          console.log('Response from promise ',JSON.stringify(fromRunpy));
        
      });

      });
    });
  });

}

  
let runPy  =
   new Promise(function (fulfill, reject) {
    console.log('Inside promise');
    var process = spawn('python',["D:/merakiRetailAnalyticsPhaseTwo/Weapon_Detection/TensorFlow/models/research/object_detection/Object_detection_image.py", "image-snapshot.jpg"] ); 
    process.stderr.on('data', (data) => {

      reject(data);
  });
  
    let returnData = {};
    returnData.isGunDetected = "true";
    
    process.stdout.on('data', function(data) { 
      console.log('---------------------DATA----------------------------',data.toString());
  } ) 
  fulfill(returnData);
 });



module.exports.snapshotApi = imageJob;