var schedule = require("node-schedule");
var config = require("config");
var Request = require("request");
const debug = require("debug");
var dateFormat = require("dateformat");

// var startDate = new Date();
let startDate = new Date("2019-03-23");

// var stopDate = new Date(year,month,date[,hour,minute,second,millisecond ])
console.log('start date ', startDate.getTime());
let stopDate = new Date("2019-03-23");
console.log('stopDate ', stopDate);

let dateArray = getDates(startDate, stopDate);
console.log(dateArray);


dateArray.forEach(function (dateValue) {
    for (hourValue = 2; hourValue <= 16; hourValue++) {
        let tempDateForEachHour = new Date(dateValue.getTime() + (hourValue * 60 * 60 * 1000));
        for (i = 0; i <= 59; i++) {
            let tempDateForEachMinute = tempDateForEachHour.getTime() + (i * 60 * 1000);
            let tempDate = new Date(tempDateForEachMinute);
            console.log('Per minute date ', tempDate);

            var cameraDataUrl = "http://localhost:4004/api/v0/meraki/camera/datasetgen";
          
            let requestParams = {};
            requestParams.tsValue = tempDateForEachMinute;
        Request.post({
            "headers": {
                "Content-Type": "application/json",
                "Content-Length": JSON.stringify(requestParams).length
            },
            "url": cameraDataUrl,
            "body": JSON.stringify(requestParams) 
            }, (error, response, body) => {
                if (error) {
                    console.log("Error: " + error.message);
                } else {
                    let returnData = {};
                    returnData = JSON.parse(body);
                    console.log("Response success : " + returnData);
                }
            });


        }

    }
});


function getDates(startDate1, stopDate1) {
    let dateArray1 = new Array();    
    console.log('current value of stop date', stopDate1);
    while (stopDate1 <= startDate1) {
        dateArray1.push(stopDate1);
        stopDate1 = new Date(stopDate1.getTime() + 1 * 86400000);
    }
    return dateArray1;
}