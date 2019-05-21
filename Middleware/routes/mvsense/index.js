var express = require("express");
var router = express.Router();
var dateFormat = require("dateformat");
var rn = require('random-number');


router.get("/devices/camera/analytics/recent", function (req, res) {

    let zoneId = req.query.zoneId

    var generateEntrances = rn.generator({
        min: 0,
        max: 2,
        integer: true
    })
    
    var generateAvgcount =  rn.generator({
        min: 0,
        max: 10,
        integer: false
    })


    let endDate = new Date();
    let ts = endDate.getTime();
    let endTsValue = dateFormat(endDate, "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'");
    console.log('End ts value is ',endTsValue);
    let startTsMs = ts+1000;
    console.log('startTs miliseconds ',startTsMs)
    let startDate = new Date(endDate.getTime() - 1*60000);
    console.log('Date object for startTs is ',startDate);


    let responseObject = {};
    responseObject.zone = zoneId;
    responseObject.startTs = startDate.toISOString();
    responseObject.endTs = endDate.toISOString();
    responseObject.entrances = generateEntrances();
    responseObject.averageCount = generateAvgcount();

    console.log(responseObject);

    res.status(200).send(responseObject);






});

module.exports = router;
