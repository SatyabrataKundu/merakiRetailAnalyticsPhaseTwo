var schedule = require("node-schedule");
var config = require("config");
var Request = require("request");
const debug = require("debug");
var dateFormat = require("dateformat");
var promise = require("bluebird");
var rn = require('random-number');

var dbOptions = {
    // Initialization Options
    promiseLib: promise
};
var pgp = require("pg-promise")(dbOptions);

var connectionString = "postgres://" + config.get("environment.merakiConfig.dbUserName") + ":" +
    config.get("environment.merakiConfig.dbPassword") + "@db:" + config.get("environment.merakiConfig.dbPort") +
    "/" + config.get("environment.merakiConfig.dbName");
var db = pgp(connectionString);


var job = function SaveCameraDataForWaitTime() {
    schedule.scheduleJob(config.get("environment.constants.mvsenseSaveRecentApiData"), function () {
        var datetime = new Date();
        for(let i=1 ; i<=5 ; i++){
            console.log("Meraki Camera Job Running at : ", datetime);
            var cameraDataUrl = config.get("simulator.merakicam.mvsenseRESTRecentApi");
            var propertiesobj = {zoneId : i}
            Request.get({
                "url":cameraDataUrl,
                "qs" : propertiesobj
            }, (error, response, body) => {
                if (error) {
                    debug("Error: " + error.message);
                } else {
    
                    console.log('BODY',body);
                    let result = JSON.parse(body);
                    let dbInsertCamData = {};
                    
                    let startDateISO = new Date(result.startTs);
                    dbInsertCamData.startDate = startDateISO.getTime();
                    let endDateISO = new Date(result.endTs);
                    dbInsertCamData.endDate = endDateISO.getTime();
                    dbInsertCamData.averageCount = result.averageCount;
                    dbInsertCamData.entrances = result.entrances;
                    dbInsertCamData.zone = result.zone;
                    _performDBInsert(dbInsertCamData);
                }
            });
        }
       
    });
}


function _performDBInsert(dbInsertCamData) {
    return new Promise(function (fulfill, reject) {
        var insertQueryForDB = "INSERT INTO meraki.mvsense_restapi_data "
            + "(start_date,"
            + "end_date,"
            + "average_count, "
            + "entrances,"
            + "zone_id "
            + ")"
            + " VALUES ("
            + dbInsertCamData.startDate + ","
            + dbInsertCamData.endDate + ","
            + dbInsertCamData.averageCount + ","
            + dbInsertCamData.entrances + ","
            + dbInsertCamData.zone+")";

            console.log(insertQueryForDB)

        db.none(insertQueryForDB)
            .then(function (response) {
                console.log('INSERT SUCCESS ',dbInsertCamData);
                fulfill(response);
            })
            .catch(function (err) {
                console.log("not able to get connection " + err);
                reject(err);
            });
    });
}
module.exports.saveCamData = job;