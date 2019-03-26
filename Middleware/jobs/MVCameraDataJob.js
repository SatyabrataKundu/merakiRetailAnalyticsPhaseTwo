var schedule = require("node-schedule");
var config = require("config");
var Request = require("request");
const debug = require("debug");
var dateFormat = require("dateformat");

var job = function MVCameraDataJob() {
    schedule.scheduleJob(config.get("environment.constants.mvCameraJobTimer"), function () {
        var datetime = new Date();
        console.log("Meraki Camera Job Running at : ", datetime);
        var cameraDataUrl = config.get("simulator.merakicam.fetchCameraDetectionsApi");

        Request.get({
            "url":cameraDataUrl     
        }, (error, response, body) => {
            if (error) {
                debug("Error: " + error.message);
            } else {
                let returnData = {};
                returnData = JSON.parse(body);
                debug("Response success : " + returnData);
            }
        });
    });
}

module.exports.cameraJob = job;