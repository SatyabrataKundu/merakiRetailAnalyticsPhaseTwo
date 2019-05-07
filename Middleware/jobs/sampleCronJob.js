var schedule = require("node-schedule");
var config = require("config");
var Request = require("request");
const debug = require("debug");
var dateFormat = require("dateformat");

let startDate = new Date(config.get("simulator.datasetup.startDate"));
console.log('start date ', startDate.getTime());
let stopDate = new Date(config.get("simulator.datasetup.stopDate"));
console.log('stopDate ', stopDate);

let dateArray = getDates(startDate, stopDate);


dateArray.forEach(function (dateValue) {
	for (hourValue = 0; hourValue <= 23; hourValue++) {
		let tempDateForEachHour = new Date(dateValue.getTime() + (hourValue * 60 * 60 * 1000));

		let tempDateForEachMinute = tempDateForEachHour.getTime()

		let tempDate = new Date(tempDateForEachMinute);
		console.log('Per minute date ', tempDate);

		var cameraDataUrl = config.get("simulator.datasetup.datawithoutoid_url");

		let requestParams = {};
		requestParams.tsValue = tempDateForEachMinute;
		requestParams.incremental = 25;
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
});


function getDates(startDate1, stopDate1) {
	let dateArray1 = new Array();
	console.log('current value of start date', startDate1);
	while (startDate1 <= stopDate1) {
		dateArray1.push(startDate1);
		startDate1 = new Date(startDate1.getTime() + 1 * 86400000);
	}
	return dateArray1;
}