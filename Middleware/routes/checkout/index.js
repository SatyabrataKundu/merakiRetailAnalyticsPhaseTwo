var express = require("express");
var router = express.Router();
var dateFormat = require("dateformat");
var promise = require("bluebird");
var config = require("config");
var rn = require('random-number');
var path = require('path');

var dbOptions = {
    // Initialization Options
    promiseLib: promise
};
var pgp = require("pg-promise")(dbOptions);

router.get("/getimage",function(req,res){

    var gen = rn.generator({
        min: 1,
        max: 96,
        integer: true
    })

    let fileName = gen() + ".jpg";
    var raltivePath =  path.join(__dirname, '..','..','..');
    let filePath = raltivePath+"/Weapon_Detection/TensorFlow/Data/SnapShots/" + fileName;
    res.sendFile(filePath);
})
var connectionString = "postgres://" + config.get("environment.merakiConfig.dbUserName") + ":" +
    config.get("environment.merakiConfig.dbPassword") + "@localhost:" + config.get("environment.merakiConfig.dbPort") +
    "/" + config.get("environment.merakiConfig.dbName");
var db = pgp(connectionString);

router.get("/waitTime", function (req, res) {
    // res.status(200).send("success");
    var endDate = new Date();
    var startdate = new Date();
    var durationInMinutes = config.get("simulator.checkout.queueconstant");
    startdate.setMinutes(endDate.getMinutes() - durationInMinutes);
    console.log("Start Date " + startdate);
    console.log("End Date " + endDate);

    //  let query = "select (case when ROUND((count(distinct (cam.person_oid)) - count(distinct(unique_pos_data_key)))/2.0,2)>0 Then  ROUND((count(distinct (cam.person_oid)) - count(distinct(unique_pos_data_key)))/2.0,2) ELSE 0 END) as waitTime, "
    //     + "mapp.pos_counter_number "
    //     + "from meraki.camera_detections cam right outer join meraki.checkoutzone_billingcounter_map mapp "
    //     + "on cam.zoneid=mapp.zone_id and (cam.datetime between " + startdate.getTime() + " and " + endDate.getTime() + ") left outer join meraki.pos_data pos "
    //     + "on mapp.pos_counter_number=pos.pos_counter_number "
    //     + "and (pos.datetime between  " + startdate.getTime() + " and " + endDate.getTime() + ") "
    //     + " group by cam.zoneid,mapp.pos_counter_number";
    let query = "select (case when ROUND((count(distinct (cam.person_oid)) - count(distinct(unique_pos_data_key)))/2.0,2)>0 Then  ROUND((count(distinct (cam.person_oid)) - count(distinct(unique_pos_data_key)))/2.0,2) ELSE 0 END) as waitTime, "
            + "mapp.pos_counter_number "
            + "from meraki.visitor_predictions cam right outer join meraki.checkoutzone_billingcounter_map mapp "
            + "on cam.zoneid=mapp.zone_id and (cam.datetime between " + startdate.getTime() + " and " + endDate.getTime() + ") left outer join meraki.pos_data pos "
            + "on mapp.pos_counter_number=pos.pos_counter_number "
            + "and (pos.datetime between  " + startdate.getTime() + " and " + endDate.getTime() + ") "
            + " group by cam.zoneid,mapp.pos_counter_number";
    console.log(query);
    db.any(query)
        .then(function (result) {
            console.log("db select success for date ", result);
            res.status(200).send(result);

        })
        .catch(function (err) {
            console.log("not able to get connection " + err);
            res.status(500).send(JSON.stringify(err.message));
        });
});


router.get("/totalCheckoutZoneVisitorsToday", function (req, res) {

    var datetime = new Date();
    let formattedDateString = dateFormat(datetime, "yyyy-mm-dd");

    var checkoutSelectQry = "select count(distinct(person_oid)) from meraki.visitor_predictions c , meraki.meraki_zones z" +
        " where c.zoneid = z.zone_id" +
        " and z.zone_name like 'Checkout%'" +
        " and c.dateformat_date = '" + formattedDateString + "'";


    console.log('ceckoutselect query ', checkoutSelectQry);

    db.any(checkoutSelectQry)
        .then(function (result) {
            console.log("db select success for date ", result);
            res.status(200).send(result);

        })
        .catch(function (err) {
            console.log("not able to get connection " + err);
            res.status(500).send(JSON.stringify(err.message));
        });
});
module.exports = router;

router.get("/totalCheckoutZoneAbandonmentsToday", function (req, res) {

    var datetime = new Date();
    let formattedDateString = dateFormat(datetime, "yyyy-mm-dd");

    var posSelectQry = "select ((select count(distinct (person_oid)) from meraki.visitor_predictions where zoneid in (select zone_id from meraki.meraki_zones where zone_name like 'Checkout%')" +
        "and dateformat_date like '" + formattedDateString + "') - (select count(unique_pos_data_key) from meraki.pos_data where dateformat_date like '" + formattedDateString + "') )as count"
    console.log(posSelectQry);
    db.any(posSelectQry)
        .then(function (result) {
            console.log("db select success for date ", result);
            res.status(200).send(result);

        })
        .catch(function (err) {
            console.log("not able to get connection " + err);
            res.status(500).send(JSON.stringify(err.message));
        });
});

module.exports = router;

router.get("/totalAbandonments", function (req, res) {
    let pattern = req.query.pattern || 'today';

    if (pattern == 'Today') {
        var datetime = new Date();
        let formattedDateString = dateFormat(datetime, "d");
        queryString = "select (case when personCount-transactionCount>0 Then personCount-transactionCount   ELSE 0 END) as count, person.timeRange from (select count(distinct (person_oid)) as personCount, dateformat_hour as timeRange from meraki.visitor_predictions where zoneid in (select zone_id from meraki.meraki_zones where zone_name like 'Checkout%')and dateformat_day = '" + formattedDateString + "' group by dateformat_hour) as person,(select count(unique_pos_data_key) as transactionCount, dateformat_hour as timeRange from meraki.pos_data where dateformat_day = '" + formattedDateString + "' group by dateformat_hour order by dateformat_hour) as posdata where person.timeRange=posdata.timeRange";
        console.log(queryString);

        db.any(queryString)
            .then(function (result) {
                res.status(200).send(result);
            })
            .catch(function (err) {
                console.log("error", err);
                res.status(500).send(JSON.stringify(err.message));
            });
    } else if (pattern == 'Yesterday') {
        var datetime = new Date();
        let formattedDateString = dateFormat(datetime, "d") - 1;
        queryString = "select (case when personCount-transactionCount>0 Then personCount-transactionCount   ELSE 0 END) as count, person.timeRange from (select count(distinct (person_oid)) as personCount, dateformat_hour as timeRange from meraki.visitor_predictions where zoneid in (select zone_id from meraki.meraki_zones where zone_name like 'Checkout%')and dateformat_day = '" + formattedDateString + "' group by dateformat_hour) as person,(select count(unique_pos_data_key) as transactionCount, dateformat_hour as timeRange from meraki.pos_data where dateformat_day = '" + formattedDateString + "' group by dateformat_hour order by dateformat_hour) as posdata where person.timeRange=posdata.timeRange";
        db.any(queryString)
            .then(function (result) {
                res.status(200).send(result);
            })
            .catch(function (err) {
                console.log("error", err);
                res.status(500).send(JSON.stringify(err.message));
            });
    } else if (pattern == 'This Week') {
        var datetime = new Date();
        let weekValue = dateFormat(datetime, "W");
        queryString = "select (case when personCount-transactionCount>0 Then personCount-transactionCount   ELSE 0 END) as count, person.timeRange from (select count(distinct (person_oid)) as personCount, dateformat_day as timeRange from meraki.visitor_predictions where zoneid in (select zone_id from meraki.meraki_zones where zone_name like 'Checkout%')and dateformat_week = '" + weekValue + "' group by dateformat_day) as person,(select count(unique_pos_data_key) as transactionCount, dateformat_day as timeRange from meraki.pos_data where dateformat_week = '" + weekValue + "' group by dateformat_day order by dateformat_day) as posdata where person.timeRange=posdata.timeRange";
        db.any(queryString)
            .then(function (result) {
                res.status(200).send(result);
            })
            .catch(function (err) {
                console.log("error", err);
                res.status(500).send(JSON.stringify(err.message));
            });
    } else if (pattern == 'Last Week') {
        var datetime = new Date();
        let weekValue = dateFormat(datetime, "W");
        weekValue = weekValue - 1;
        queryString = "select (case when personCount-transactionCount>0 Then personCount-transactionCount   ELSE 0 END) as count, person.timeRange from (select count(distinct (person_oid)) as personCount, dateformat_day as timeRange from meraki.visitor_predictions where zoneid in (select zone_id from meraki.meraki_zones where zone_name like 'Checkout%')and dateformat_week = '" + weekValue + "' group by dateformat_day) as person,(select count(unique_pos_data_key) as transactionCount, dateformat_day as timeRange from meraki.pos_data where dateformat_week = '" + weekValue + "' group by dateformat_day order by dateformat_day) as posdata where person.timeRange=posdata.timeRange";
        db.any(queryString)
            .then(function (result) {
                res.status(200).send(result);
            })
            .catch(function (err) {
                console.log("error", err);
                res.status(500).send(JSON.stringify(err.message));
            });
    } else if (pattern == 'This Month') {
        var datetime = new Date();
        let monthValue = dateFormat(datetime, "m");
        queryString="select (case when personCount-transactionCount>0 Then personCount-transactionCount   ELSE 0 END) as count, person.timeRange from (select count(distinct (person_oid)) as personCount, dateformat_week as timeRange from meraki.visitor_predictions where zoneid in (select zone_id from meraki.meraki_zones where zone_name like 'Checkout%')and dateformat_month = '"+ monthValue +"' group by dateformat_week) as person,(select count(unique_pos_data_key) as transactionCount, dateformat_week as timeRange from meraki.pos_data where dateformat_month = '"+ monthValue +"' group by dateformat_week order by dateformat_week) as posdata where person.timeRange=posdata.timeRange";
        db.any(queryString)
            .then(function (result) {
                res.status(200).send(result);
            })
            .catch(function (err) {
                console.log("error", err);
                res.status(500).send(JSON.stringify(err.message));
            });
    } else if (pattern == 'Last Month') {
        var datetime = new Date();
        let monthValue = dateFormat(datetime, "m");
        monthValue = monthValue - 1;
        queryString="select (case when personCount-transactionCount>0 Then personCount-transactionCount   ELSE 0 END) as count, person.timeRange from (select count(distinct (person_oid)) as personCount, dateformat_week as timeRange from meraki.visitor_predictions where zoneid in (select zone_id from meraki.meraki_zones where zone_name like 'Checkout%')and dateformat_month = '"+ monthValue +"' group by dateformat_week) as person,(select count(unique_pos_data_key) as transactionCount, dateformat_week as timeRange from meraki.pos_data where dateformat_month = '"+ monthValue +"' group by dateformat_week order by dateformat_week) as posdata where person.timeRange=posdata.timeRange";
        db.any(queryString)
            .then(function (result) {
                res.status(200).send(result);
            })
            .catch(function (err) {
                console.log("error", err);
                res.status(500).send(JSON.stringify(err.message));
            });
    }
})