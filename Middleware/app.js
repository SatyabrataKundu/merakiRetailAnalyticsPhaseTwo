var express = require("express");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var chalk = require("chalk");
var debug = require("debug")("app");
var cors = require("cors");
var config = require("config");
var dateFormat = require("dateformat");
var scanningapi = require("./routes/scanningapi/index");

var cronJobForAPClients = require("./jobs/AccessPointClientsJob");
var merakicamera = require("./routes/merakicamera/index");
var cronJobForMerakiCamData = require("./jobs/MVCameraDataJob");

var scanningsimulator = require("./routes/scanningsimulator/index");
var cronJobForPosData = require("./jobs/PosDataGenerationJob");
//var cronJobForImageDetection = require("./jobs/ProcessSnapshotImage");

var possimulator = require("./routes/posSimulator/index");
var checkout = require("./routes/checkout/index");

cronJobForAPClients.clientsJob();
cronJobForPosData.posJob();
//cronJobForImageDetection.snapshotApi();
cronJobForMerakiCamData.cameraJob();
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cors());
app.use(morgan("tiny"));
app.use("/api/v0/meraki/scanning", scanningapi);
app.use("/api/v0/meraki/scanningsimulator", scanningsimulator);
app.use("/api/v0/meraki/posSimulator", possimulator);
app.use("/api/v0/meraki/camera",merakicamera);
app.use("/api/v0/meraki/checkout",checkout);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error("Not Found");
	err.status = 404;
	next(err);
});
var expressPort = "";
if (config.has("environment.constants.expressPort")) {
	expressPort = config.get("environment.constants.expressPort");
}


app.set("port", process.env.PORT || expressPort);
var server = app.listen(app.get("port"), function () {
	debug(`Express server listening on port ${chalk.red(server.address().port)}`);
});

var datetime = new Date();
let dayStringValue = dateFormat(datetime, "dddd");

console.log(dayStringValue);