var schedule = require("node-schedule");
var config = require("config");

var job = function SampleCronJob() {
	schedule.scheduleJob(config.get("environment.constants.timerForApDetailsJob"), function () {
		var datetime = new Date();
		console.log("Sample Job Running at : ", datetime);
	
	});
};

module.exports.clientsJob = job;