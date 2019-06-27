var schedule = require("node-schedule");
var config = require("config");
var rn = require('random-number');
var Request = require("request");
const debug = require("debug");
var promise = require("bluebird");
var dateFormat = require("dateformat");
let date = require('date-and-time');
var dbOptions = {
    // Initialization Options
    promiseLib: promise
};
var pgp = require("pg-promise")(dbOptions);

var connectionString = "postgres://" + config.get("environment.merakiConfig.dbUserName") + ":" +
    config.get("environment.merakiConfig.dbPassword") + "@db:" + config.get("environment.merakiConfig.dbPort") +
    "/" + config.get("environment.merakiConfig.dbName");
var db = pgp(connectionString);


var job = function AccessPointClientsJob() {
    schedule.scheduleJob(config.get("environment.constants.apclientsJobTimer"), function () {
        var datetime = new Date();
        console.log("Sample Job Running at : ", datetime);

        //POST call to scanning api method to perform logic and db insertion.
        _performUrlPost().then(function (result) {
            console.log('simulated apclient data is stored in database.');

            result.forEach(function (value) {

                var datetime = new Date();
               
                let formattedDateString = dateFormat(datetime, "yyyy-mm-dd");
                let yearValue = dateFormat(datetime, "yyyy");
                let monthValue = dateFormat(datetime, "m");
                let weekValue = dateFormat(datetime, "W");
                let dayValue = dateFormat(datetime, "d");
                let hourValue = dateFormat(datetime, "H");
                let minuteValue = dateFormat(datetime, "M");

                var insertQueryForDB = "INSERT INTO meraki.scanning_ap_data "
                    + "(ap_mac_address,"
                    + "client_mac_address,"
                    + "datetime, "
                    + "dateformat_date,"
                    + "dateformat_year, "
                    + "dateformat_month,"
                    + "dateformat_week, "
                    + "dateformat_day, "
                    + "dateformat_hour, "
                    + "dateformat_minute,"
                    + "rssi,"
                    + "seen_epoch )"
                    + " VALUES ('"
                    + JSON.stringify(value.apMacAddress) + "','"
                    + JSON.stringify(value.clientMacAddress) + "',"
                    + datetime.getTime() + ",'"
                    + formattedDateString + "',"
                    + yearValue + ","
                    + monthValue + ","
                    + weekValue + ","
                    + dayValue + ","
                    + hourValue + ","
                    + minuteValue + ","
                    + value.rssi + ","
                    + value.seenEpoch
                    + ")";

                return new Promise(function (fulfill, reject) {
                    db.none(insertQueryForDB)
                        .then(function (response) {

                            console.log("db insert success for clientMac ", value.clientMacAddress);
                            fulfill(response);
                        })
                        .catch(function (err) {
                            console.log("not able to get connection " + err);
                            reject(err);
                        });
                });
            });
        });
    });
};

function _performUrlPost() {

    var apList = [];
    apList.push(config.get("simulator.scanning.apMac1"));
    apList.push(config.get("simulator.scanning.apMac2"));
    apList.push(config.get("simulator.scanning.apMac3"));
    apList.push(config.get("simulator.scanning.apMac4"));

    console.log('Printing aplist ', apList);
    var gen = rn.generator({
        min: config.get("simulator.scanning.minimum_clients_ap"),
        max: config.get("simulator.scanning.maximum_clients_ap"),
        integer: true
    })

    var reqPostParams = {};
    let arrayOfData = [];

    apList.forEach(apMacAddr => {

        let apClientsObject = {};
        apClientsObject.apMacAddr = apMacAddr;
        apClientsObject.numberOfClients = gen();
        arrayOfData.push(apClientsObject);

    });
    reqPostParams.data = arrayOfData;

    var url = config.get("simulator.scanning.apiForSimulatedScanningApiData");
    return new Promise(function (fulfill, reject) {

        Request.post({
            "headers": {
                "Content-Type": "application/json",
                "Content-Length": JSON.stringify(reqPostParams).length
            },
            "url": config.get("simulator.scanning.apiForSimulatedScanningApiData"),
            "body": JSON.stringify(reqPostParams)
        }, (error, response, body) => {
            if (error) {
                debug("Error: " + error.message);
                reject(error);

            }
            else {
                let returnData = {};
                returnData = JSON.parse(body);
                debug("Response success : " + returnData);
                fulfill(returnData);
            }
        });
    });
}

module.exports.clientsJob = job;




