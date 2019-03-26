var schedule = require("node-schedule");
var config = require("config");
var Request = require("request");
const debug = require("debug");
var dateFormat = require("dateformat");

var job = function POSCronJob() {
    schedule.scheduleJob(config.get("environment.constants.posJobTimer"), function () {
        var datetime = new Date();
        console.log("POS Job Running at : ", datetime);
        var url = config.get("simulator.scanning.apiForSimulatedScanningApiData");

        Request.get({
            "url": config.get("simulator.pos.posSimulatedData")       
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

module.exports.posJob = job;