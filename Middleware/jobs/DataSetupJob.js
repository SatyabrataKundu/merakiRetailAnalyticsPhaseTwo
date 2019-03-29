var schedule = require("node-schedule");
var config = require("config");
var Request = require("request");
const debug = require("debug");
var dateFormat = require("dateformat");

// var startDate = new Date();
var startDate = new Date("2019-03-28");

// var stopDate = new Date(year,month,date[,hour,minute,second,millisecond ])
console.log('start date ', startDate);
var stopDate = new Date("2019-03-28");
console.log('stopDate ', stopDate.getTime());

let dateArray = getDates(startDate, stopDate);
//  console.log(dateArray);


dateArray.forEach(function (dateValue) {
    for (hourValue = 8; hourValue <= 22; hourValue++) {
        var tempDateForEachHour = new Date(dateValue.setTime(dateValue.getTime() + (hourValue * 60 * 60 * 1000)));
        for (i = 0; i <= 59; i++) {
            var tempDateForEachMinute = dateValue.setTime(tempDateForEachHour.getTime() + (i * 60 * 1000));
            var tempDate = new Date(tempDateForEachMinute);
            console.log('Per minute date ', tempDate);
        }

    }
});


function getDates(startDate, stopDate) {
    var dateArray = new Array();    

    console.log('current value of stop date', stopDate);
    while (stopDate <= startDate) {
        dateArray.push(stopDate);
        stopDate = new Date(stopDate.setTime(stopDate.getTime() + 1 * 86400000));
    }
    return dateArray;
}