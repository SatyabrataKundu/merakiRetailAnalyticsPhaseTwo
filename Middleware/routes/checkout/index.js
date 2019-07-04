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
    let filePath = raltivePath+"/Middleware/SnapShots/" + fileName;
    res.sendFile(filePath);
})
var connectionString = "postgres://" + config.get("environment.merakiConfig.dbUserName") + ":" +
    config.get("environment.merakiConfig.dbPassword") + "@db:" + config.get("environment.merakiConfig.dbPort") +
    "/" + config.get("environment.merakiConfig.dbName");
var db = pgp(connectionString);


router.get("/waitTime", function (req, res) {
    

    //take average of 10 minutes of average count from meraki.mvsense_restapi_data
    //take average of 10 minutes of pos transaction count from meraki.pos_data

    //calculate waittime for any queue = avg_count * avg_pos_trans
    // do this for all the 5 counters

    var endDate = new Date();
    var startdate = new Date();
    var durationInMinutes = config.get("simulator.checkout.queueconstant");
    startdate.setMinutes(endDate.getMinutes() - durationInMinutes);

    var numberOfPOSCounters = config.get("simulator.checkout.counters");
    // var queryForAverageCount = "SELECT zone_id, sum(average_count)/10 as average_customers "
    // + "FROM meraki.mvsense_restapi_data where start_date > 1558429800000 "
    // + "and end_date < 1558430400000 group by zone_id "

    // var queryForAvgTransactions = 	"select T1.pos_counter_number , "
    // +" ROUND(COUNT(T2.unique_pos_data_key)/10.0,2) as avgTransactions "
    // +" from (select * from generate_series(1,5) as pos_counter_number ) as T1 "
	// + " FULL OUTER JOIN ("
    // + " select pos_counter_number , unique_pos_data_key from meraki.pos_data "
    // + " where datetime between 1558429800000 and 1558430400000 ) as T2 "
    // + "ON T1.pos_counter_number = T2.pos_counter_number group by T1.pos_counter_number "
    // + "order by T1.pos_counter_number";



   var finalQueryForWaitTime = " SELECT t3.pos_counter_number , "
   + " ROUND(t4.average_customers* t3.time_for_1_transaction_in_mins,2) as waittime_inminutes FROM  "
   + " (select T1.pos_counter_number , "
   + " case when COUNT(T2.unique_pos_data_key) > 0 THEN "
   + " ROUND("+durationInMinutes+"/COUNT(T2.unique_pos_data_key),2) else -1 END as time_for_1_transaction_in_mins "
   + " from (select * from generate_series(1,"+numberOfPOSCounters+") as pos_counter_number ) as T1 "
   + " FULL OUTER JOIN "
   + " (select pos_counter_number , unique_pos_data_key from meraki.pos_data "
   + " where datetime between "+startdate.getTime()+" and "+endDate.getTime()+" ) as T2 "
   + " ON T1.pos_counter_number = T2.pos_counter_number group by T1.pos_counter_number "
   + " order by T1.pos_counter_number) AS t3 "
   + " FULL OUTER JOIN "
   + " (  select A1.pos_counter_number,"
   + " CASE WHEN A2.average_customers >0 THEN A2.average_customers ELSE 0 END as average_customers "
   + " from ((select * from generate_series(1,5) as pos_counter_number ) as A1 "
   + " FULL OUTER JOIN (SELECT zone_id AS pos_counter_number, "
   + " ROUND(sum(average_count)/"+durationInMinutes+",2) as average_customers  "
   + " FROM meraki.mvsense_restapi_data where start_date > "+startdate.getTime()+" and "
   + " end_date < "+endDate.getTime()+" group by zone_id) as A2 on "
   + " A1.pos_counter_number = A2.pos_counter_number )) as T4 "
   + " ON t3.pos_counter_number = t4.pos_counter_number  ";
   console.log('QUERY FOR WAIT TIME IN MINUTES ==================',finalQueryForWaitTime);

   db.any(finalQueryForWaitTime)
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

    var posSelectQry = "select sum (count) as count from ( select (case when personCount-transactionCount>0 Then personCount-transactionCount   ELSE 0 END) as count, person.timeRange from ( select count(distinct (person_oid)) as personCount, dateformat_hour as timeRange from meraki.visitor_predictions where zoneid in (select zone_id from meraki.meraki_zones where zone_name like 'Checkout%')and dateformat_date = '" + formattedDateString + "' group by dateformat_hour ) as person,(select count(unique_pos_data_key) as transactionCount, dateformat_hour as timeRange from meraki.pos_data where dateformat_date = '" + formattedDateString + "' group by dateformat_hour ) as posdata where person.timeRange=posdata.timeRange)as temp"
    console.log('POS QUERY======================================',posSelectQry);
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
    let pattern = req.query.pattern || 'Today';

    if (pattern == 'Today') {
        var datetime = new Date();
        let formattedDateString = dateFormat(datetime, "yyyy-mm-dd");

        queryString = "select (case when personCount-transactionCount>0 Then personCount-transactionCount   ELSE 0 END) as count, person.timeRange from (select count(distinct (person_oid)) as personCount, dateformat_hour as timeRange from meraki.visitor_predictions where zoneid in (select zone_id from meraki.meraki_zones where zone_name like 'Checkout%')and dateformat_date = '" + formattedDateString + "' group by dateformat_hour) as person,(select count(unique_pos_data_key) as transactionCount, dateformat_hour as timeRange from meraki.pos_data where dateformat_date = '" + formattedDateString + "' group by dateformat_hour order by dateformat_hour) as posdata where person.timeRange=posdata.timeRange";
        console.log('ABANDONMENTS QUERY',queryString);

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
        queryString="select (case when personCount-transactionCount>0 Then personCount-transactionCount   ELSE 0 END) as count, CONCAT('week : ',person.timeRange) as timeRange from (select count(distinct (person_oid)) as personCount, dateformat_week as timeRange from meraki.visitor_predictions where zoneid in (select zone_id from meraki.meraki_zones where zone_name like 'Checkout%')and dateformat_month = '"+ monthValue +"' group by dateformat_week) as person,(select count(unique_pos_data_key) as transactionCount, dateformat_week as timeRange from meraki.pos_data where dateformat_month = '"+ monthValue +"' group by dateformat_week order by dateformat_week) as posdata where person.timeRange=posdata.timeRange";
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
        queryString="select (case when personCount-transactionCount>0 Then personCount-transactionCount   ELSE 0 END) as count, CONCAT('week : ',person.timeRange) as timeRange from (select count(distinct (person_oid)) as personCount, dateformat_week as timeRange from meraki.visitor_predictions where zoneid in (select zone_id from meraki.meraki_zones where zone_name like 'Checkout%')and dateformat_month = '"+ monthValue +"' group by dateformat_week) as person,(select count(unique_pos_data_key) as transactionCount, dateformat_week as timeRange from meraki.pos_data where dateformat_month = '"+ monthValue +"' group by dateformat_week order by dateformat_week) as posdata where person.timeRange=posdata.timeRange";
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