var express = require("express");
var router = express.Router();
var config = require("config");
var rn = require("random-number");
var promise = require("bluebird");
var dateFormat = require("dateformat");
var dbOptions = {
  // Initialization Options
  promiseLib: promise
};
var pgp = require("pg-promise")(dbOptions);

var connectionString =
  "postgres://" +
  config.get("environment.merakiConfig.dbUserName") +
  ":" +
  config.get("environment.merakiConfig.dbPassword") +
  "@db:" +
  config.get("environment.merakiConfig.dbPort") +
  "/" +
  config.get("environment.merakiConfig.dbName");
var db = pgp(connectionString);

router.get("/", function (req, res) {
  var responseObject = {};
  var dataList = [];
  var zoneList = [];

  let dateValue = req.body.tsValue;

  var selectQuery = "select zone_id, zone_name from meraki.meraki_zones";
  db.any(selectQuery)
    .then(function (result) {
      result.forEach(function (zoneObject) {
        //Generate number of clients.
        var gen1 = rn.generator({
          min: 0,
          max: 2,
          integer: true
        });

        var gen2 = rn.generator({
          min: 5,
          max: 10,
          integer: true
        });

        var gen3 = rn.generator({
          min: 0,
          max: 1,
          integer: true
        });

        var gen4 = rn.generator({
          min: 2,
          max: 3,
          integer: true
        });

        var gen5 = rn.generator({
          min: 1,
          max: 3,
          integer: true
        });

        var datetime = new Date();
        let ts = datetime.getTime();
        let formattedDateString = dateFormat(datetime, "yyyy-mm-dd");
        let yearValue = dateFormat(datetime, "yyyy");
        let monthValue = dateFormat(datetime, "m");
        let weekValue = dateFormat(datetime, "W");
        let dayValue = dateFormat(datetime, "d");
        let hourValue = dateFormat(datetime, "H");
        let minuteValue = dateFormat(datetime, "M");
        let dayStringValue = dateFormat(datetime, "dddd");

        console.log("DAY OF THE WEEK ", dayStringValue);
        console.log("HOUR OF THE DAY IS ", hourValue);

        let dbInsertCamData = {};
        dbInsertCamData.ts = ts;
        dbInsertCamData.dateFormat_date = formattedDateString;
        dbInsertCamData.dateFormat_year = yearValue;
        dbInsertCamData.dateFormat_month = monthValue;
        dbInsertCamData.dateFormat_week = weekValue;
        dbInsertCamData.dateFormat_day = dayValue;
        dbInsertCamData.dateFormat_hour = hourValue;
        dbInsertCamData.dateFormat_minute = minuteValue;
        dbInsertCamData.rush_hour = false;
        dbInsertCamData.shop_closed = false;

        var numberOfPeopleDetected = 0;
        if (zoneObject.zone_id === 1 || zoneObject.zone_id === 12) {
          numberOfPeopleDetected = gen2();
        } else if (
          zoneObject.zone_id === 3 ||
          zoneObject.zone_id === 4 ||
          zoneObject.zone_id === 5 ||
          zoneObject.zone_id === 2 ||
          zoneObject.zone_id === 6
        ) {
          numberOfPeopleDetected = gen3();
        } else if (zoneObject.zone_id === 7) {
          numberOfPeopleDetected = gen1();
        } else if (zoneObject.zone_id === 8 || zoneObject.zone_id === 11) {
          numberOfPeopleDetected = 20 + gen1();
        } else {
          numberOfPeopleDetected = 15 + gen1();
        }

        if (dayStringValue === "Sunday" || dayStringValue === "Saturday") {
          console.log("ITS WEEEKEND");

          numberOfPeopleDetected = numberOfPeopleDetected + 4;
        }
        if (hourValue == 18 || hourValue == 19) {
          numberOfPeopleDetected = numberOfPeopleDetected + 3;
          dbInsertCamData.rush_hour = true;
          console.log(
            "HOUR IS 18 SO ADDING 10 TO THE NUMBEROFPEOPLEDETECTED, ",
            numberOfPeopleDetected
          );
        }


        if (hourValue >= 23 || hourValue <= 7) {
          dbInsertCamData.shop_closed = true;
        }

        for (i = 0; i < numberOfPeopleDetected; i++) {
          var genOID = rn.generator({
            min: 100000,
            max: 999999,
            integer: true
          });
          if (zoneObject.zone_id === 8 && i < 20) {
            dbInsertCamData.personOID = 1000001 + i;
            dbInsertCamData.zoneId = zoneObject.zone_id;
          }
          if (zoneObject.zone_id === 11 && i < 20) {
            dbInsertCamData.personOID = 2000001 + i;
            dbInsertCamData.zoneId = zoneObject.zone_id;
          } else if (zoneObject.zone_id === 9 && i < 15) {
            dbInsertCamData.personOID = 3000001 + i;
            dbInsertCamData.zoneId = zoneObject.zone_id;
          } else if (zoneObject.zone_id === 10 && i < 15) {
            dbInsertCamData.personOID = 4000001 + i;
            dbInsertCamData.zoneId = zoneObject.zone_id;
          } else {
            dbInsertCamData.personOID = genOID();
            dbInsertCamData.zoneId = zoneObject.zone_id;
          }
          _performDBInsert(dbInsertCamData);
          dataList.push(dbInsertCamData);
        }

      });
    })
    .catch(function (err) {
      console.log("not able to get connection " + err);
    });
  responseObject.status = "SUCCESS";
  res.status(200).send(responseObject);
});

function _performDBInsert(dbInsertCamData) {
  return new Promise(function (fulfill, reject) {
    var insertQueryForDB =
      "INSERT INTO meraki.visitor_predictions " +
      "(person_oid," +
      "zoneId," +
      "datetime, " +
      "dateformat_date," +
      "dateformat_year, " +
      "dateformat_month," +
      "dateformat_week, " +
      "dateformat_day, " +
      "dateformat_hour, " +
      "dateformat_minute," +
      "rush_hour," +
      "shop_closed," +
      "day_of_week" +
      ")" +
      " VALUES (" +
      dbInsertCamData.personOID +
      "," +
      dbInsertCamData.zoneId +
      "," +
      dbInsertCamData.ts +
      ",'" +
      dbInsertCamData.dateFormat_date +
      "'," +
      dbInsertCamData.dateFormat_year +
      "," +
      dbInsertCamData.dateFormat_month +
      "," +
      dbInsertCamData.dateFormat_week +
      "," +
      dbInsertCamData.dateFormat_day +
      "," +
      dbInsertCamData.dateFormat_hour +
      "," +
      dbInsertCamData.dateFormat_minute +
      "," +
      dbInsertCamData.rush_hour +
      "," +
      dbInsertCamData.shop_closed +
      ",'" +
      dbInsertCamData.day_of_week +
      "')";

    db.none(insertQueryForDB)
      .then(function (response) {
        console.log(
          "db insert success for oid and zone  ",
          dbInsertCamData.personOID + " zone " + dbInsertCamData.zoneId
        );
        fulfill(response);
      })
      .catch(function (err) {
        console.log("not able to get connection " + err);
        reject(err);
      });
  });
}

router.post("/clients", function (req, res) {
  var zoneId = req.body.zoneId;
  var timeRange = req.body.timeRange || "today";

  console.log("Value of zone id is ", zoneId);
  console.log("value of time range is ", timeRange);

  if (timeRange === "today") {
    let datetime = new Date();
    let formattedDateString = dateFormat(datetime, "yyyy-mm-dd");

    let selectDataQuery =
      "select count(person_oid) as detected_clients , dateformat_hour as timeRange" +
      " from meraki.visitor_predictions " +
      " where zoneid=" +
      zoneId +
      " and dateformat_date='" +
      formattedDateString +
      "' group by dateformat_hour order by dateformat_hour";

    db.any(selectDataQuery)
      .then(function (result) {
        console.log("db select success", result);
        res.status(200).send(result);
      })
      .catch(function (err) {
        console.log("not able to get connection " + err);
        res.status(500).send(JSON.stringify(err.message));
      });
  } else if (timeRange === "yesterday") {
    let datetime = new Date();
    datetime.setDate(datetime.getDate() - 1);
    let formattedDateString = dateFormat(datetime, "yyyy-mm-dd");

    let selectDataQuery =
      "select count(person_oid) as detected_clients , dateformat_hour as timeRange" +
      " from meraki.visitor_predictions " +
      " where zoneid=" +
      zoneId +
      " and dateformat_date='" +
      formattedDateString +
      "' group by dateformat_hour order by dateformat_hour";
    db.any(selectDataQuery)
      .then(function (result) {
        console.log("db select success", result);
        res.status(200).send(result);
      })
      .catch(function (err) {
        console.log("not able to get connection " + err);
        res.status(500).send(JSON.stringify(err.message));
      });
  } else if (timeRange === "this week") {
    let datetime = new Date();
    let weekValue = dateFormat(datetime, "W");
    let yearValue = dateFormat(datetime, "yyyy");
    let selectDataQuery =
      "select count(person_oid) as detected_clients , dateformat_date as timeRange" +
      " from meraki.visitor_predictions " +
      " where zoneid=" +
      zoneId +
      " and dateformat_week=" +
      weekValue +
      " and dateformat_year=" +
      yearValue +
      " group by dateformat_date order by dateformat_date";
    db.any(selectDataQuery)
      .then(function (result) {
        console.log("db select success", result);
        res.status(200).send(result);
      })
      .catch(function (err) {
        console.log("not able to get connection " + err);
        res.status(500).send(JSON.stringify(err.message));
      });
  } else if (timeRange === "last week") {
    let datetime = new Date();
    let weekValue = dateFormat(datetime, "W") - 1;
    let yearValue = dateFormat(datetime, "yyyy");

    let selectDataQuery =
      "select count(person_oid) as detected_clients , dateformat_date as timeRange" +
      " from meraki.visitor_predictions " +
      " where zoneid=" +
      zoneId +
      " and dateformat_week=" +
      weekValue +
      " and dateformat_year=" +
      yearValue +
      " group by dateformat_date order by dateformat_date";
    db.any(selectDataQuery)
      .then(function (result) {
        console.log("db select success", result);
        res.status(200).send(result);
      })
      .catch(function (err) {
        console.log("not able to get connection " + err);
        res.status(500).send(JSON.stringify(err.message));
      });
  } else if (timeRange === "this month") {
    let datetime = new Date();
    let monthValue = dateFormat(datetime, "m");
    let yearValue = dateFormat(datetime, "yyyy");
    let selectDataQuery =
      "select count(person_oid) as detected_clients , CONCAT('Week-',dateformat_week) as timeRange" +
      " from meraki.visitor_predictions " +
      " where zoneid=" +
      zoneId +
      " and dateformat_month=" +
      monthValue +
      " and dateformat_year=" +
      yearValue +
      " group by dateformat_week order by dateformat_week";
    db.any(selectDataQuery)
      .then(function (result) {
        console.log("db select success", result);
        res.status(200).send(result);
      })
      .catch(function (err) {
        console.log("not able to get connection " + err);
        res.status(500).send(JSON.stringify(err.message));
      });
  } else if (timeRange === "last month") {
    let datetime = new Date();
    let monthValue = dateFormat(datetime, "m") - 1;
    let yearValue = dateFormat(datetime, "yyyy");
    let selectDataQuery =
      "select count(person_oid) as detected_clients ,  CONCAT('Week-',dateformat_week) as timeRange" +
      " from meraki.visitor_predictions " +
      " where zoneid=" +
      zoneId +
      " and dateformat_month=" +
      monthValue +
      " and dateformat_year=" +
      yearValue +
      " group by dateformat_week order by dateformat_week";
    db.any(selectDataQuery)
      .then(function (result) {
        console.log("db select success", result);
        res.status(200).send(result);
      })
      .catch(function (err) {
        console.log("not able to get connection " + err);
        res.status(500).send(JSON.stringify(err.message));
      });
  }
});

router.get("/zones", function (req, res) {
  var responseObject = {};

  var zoneList = [];
  var selectQuery =
    "select zone_id as zoneId, zone_name as zoneName from meraki.meraki_zones where zone_name not like 'Checkout%'";
  db.any(selectQuery)
    .then(function (result) {
      console.log("db select success for date ", result);
      res.status(200).send(result);
    })
    .catch(function (err) {
      console.log("not able to get connection " + err);
      res.status(500).send(JSON.stringify(err.message));
    });
});

router.get("/currentVisitorsPerZone", function (req, res) {
  var datetime = new Date();
  let formattedDateString = dateFormat(datetime, "yyyy-mm-dd");
  let hourValue = dateFormat(datetime, "H");

  var selectQuery =
    "SELECT COUNT(DISTINCT(cam.person_oid)), zones.zone_id , zones.zone_name from meraki.meraki_zones zones left join meraki.visitor_predictions cam " +
    " on cam.zoneid = zones.zone_id and  " +
    " cam.dateformat_date = '" +
    formattedDateString +
    "' and cam.dateformat_hour=" +
    hourValue +
    " and cam.dateformat_minute= (select dateformat_minute from meraki.visitor_predictions " +
    " order by datetime desc LIMIT 1 ) " +
    " where  zones.zone_name not like 'Checkout%'" +
    " group by zones.zone_id, zones.zone_name";

  var checkoutSelectQuery =
    "SELECT COUNT(DISTINCT(cam.person_oid)), 15 , 'Checkout'" +
    " from meraki.visitor_predictions cam, meraki.meraki_zones zones where " +
    " cam.zoneid = zones.zone_id and  " +
    " cam.dateformat_date = '" +
    formattedDateString +
    "' and cam.dateformat_hour=" +
    hourValue +
    " and  zones.zone_name like 'Checkout%'" +
    " and cam.dateformat_minute= (select dateformat_minute from meraki.visitor_predictions " +
    " order by datetime desc LIMIT 1 ) ";

  var finalSelect = selectQuery + " UNION ALL " + checkoutSelectQuery;
  db.any(finalSelect)
    .then(function (result) {
      console.log("db select success for date ", result);
      res.status(200).send(result);
    })
    .catch(function (err) {
      console.log("not able to get connection " + err);
      res.status(500).send(JSON.stringify(err.message));
    });
});
router.post("/datasetgen", function (req, res) {
  var responseObject = {};
  var dataList = [];
  var zoneList = [];

  let dateValue = req.body.tsValue;

  var selectQuery = "select zone_id, zone_name from meraki.meraki_zones";
  db.any(selectQuery)
    .then(function (result) {
      result.forEach(function (zoneObject) {
        //Generate number of clients.
        var gen1 = rn.generator({
          min: 0,
          max: 2,
          integer: true
        });

        var gen2 = rn.generator({
          min: 5,
          max: 10,
          integer: true
        });

        var gen3 = rn.generator({
          min: 0,
          max: 1,
          integer: true
        });

        var gen4 = rn.generator({
          min: 2,
          max: 3,
          integer: true
        });

        var gen5 = rn.generator({
          min: 1,
          max: 3,
          integer: true
        });

        var datetime = new Date(dateValue);
        let ts = datetime.getTime();
        let formattedDateString = dateFormat(datetime, "yyyy-mm-dd");
        let yearValue = dateFormat(datetime, "yyyy");
        let monthValue = dateFormat(datetime, "m");
        let weekValue = dateFormat(datetime, "W");
        let dayValue = dateFormat(datetime, "d");
        let hourValue = dateFormat(datetime, "H");
        let minuteValue = dateFormat(datetime, "M");
        let dayStringValue = dateFormat(datetime, "dddd");

        console.log("DAY OF THE WEEK ", dayStringValue);
        console.log("HOUR OF THE DAY IS ", hourValue);

        let dbInsertCamData = {};
        dbInsertCamData.ts = ts;
        dbInsertCamData.dateFormat_date = formattedDateString;
        dbInsertCamData.dateFormat_year = yearValue;
        dbInsertCamData.dateFormat_month = monthValue;
        dbInsertCamData.dateFormat_week = weekValue;
        dbInsertCamData.dateFormat_day = dayValue;
        dbInsertCamData.dateFormat_hour = hourValue;
        dbInsertCamData.dateFormat_minute = minuteValue;
        dbInsertCamData.rush_hour = false;
        dbInsertCamData.shop_closed = false;

        var numberOfPeopleDetected = 0;
        if (zoneObject.zone_id === 1 || zoneObject.zone_id === 12) {
          numberOfPeopleDetected = gen2();
        } else if (
          zoneObject.zone_id === 3 ||
          zoneObject.zone_id === 4 ||
          zoneObject.zone_id === 5 ||
          zoneObject.zone_id === 2 ||
          zoneObject.zone_id === 6
        ) {
          numberOfPeopleDetected = gen3();
        } else if (zoneObject.zone_id === 7) {
          numberOfPeopleDetected = gen1();
        } else if (zoneObject.zone_id === 8 || zoneObject.zone_id === 11) {
          numberOfPeopleDetected = 20 + gen1();
        } else {
          numberOfPeopleDetected = 15 + gen1();
        }

        if (dayStringValue === "Sun" || dayStringValue === "Sat") {
          console.log("ITS WEEEKEND");

          numberOfPeopleDetected = numberOfPeopleDetected + 4;
        }
        if (hourValue == 18 || hourValue == 19) {
          numberOfPeopleDetected = numberOfPeopleDetected + 3;
          dbInsertCamData.rush_hour = true;
          console.log(
            "HOUR IS 18 SO ADDING 10 TO THE NUMBEROFPEOPLEDETECTED, ",
            numberOfPeopleDetected
          );
        }

        if (hourValue >= 23 || hourValue <= 7) {
          dbInsertCamData.shop_closed = true;
        }

        // console.log('NUMBER OF PEOPLE DETECTED ARE ',numberOfPeopleDetected);
        // numberOfPeopleDetected = numberOfPeopleDetected + 20;

        for (i = 0; i < numberOfPeopleDetected; i++) {
          var genOID = rn.generator({
            min: 100000,
            max: 999999,
            integer: true
          });
          if (zoneObject.zone_id === 8 && i < 20) {
            dbInsertCamData.personOID = 1000001 + i;
            dbInsertCamData.zoneId = zoneObject.zone_id;
          }
          if (zoneObject.zone_id === 11 && i < 20) {
            dbInsertCamData.personOID = 2000001 + i;
            dbInsertCamData.zoneId = zoneObject.zone_id;
          } else if (zoneObject.zone_id === 9 && i < 15) {
            dbInsertCamData.personOID = 3000001 + i;
            dbInsertCamData.zoneId = zoneObject.zone_id;
          } else if (zoneObject.zone_id === 10 && i < 15) {
            dbInsertCamData.personOID = 4000001 + i;
            dbInsertCamData.zoneId = zoneObject.zone_id;
          } else {
            dbInsertCamData.personOID = genOID();
            dbInsertCamData.zoneId = zoneObject.zone_id;
          }
          _performDBInsert(dbInsertCamData);
          dataList.push(dbInsertCamData);
        }
      });
    })
    .catch(function (err) {
      console.log("not able to get connection " + err);
    });
  responseObject.status = "SUCCESS";
  res.status(200).send(responseObject);
});


router.get("/dailyPredictions", function (req, res) {
  var now = new Date();
  let dayValue = dateFormat(now, "dddd");
  if (dayValue === "Tuesday") {
    now.setDate(now.getDate() - 2);
  } else if (dayValue === "Wednesday") {
    now.setDate(now.getDate() - 3);
  } else if (dayValue === "Thursday") {
    now.setDate(now.getDate() - 4);
  } else if (dayValue === "Friday") {
    now.setDate(now.getDate() - 5);
  } else if (dayValue === "Saturday") {
    now.setDate(now.getDate() - 6);
  } else if (dayValue === "Sunday") {
    now.setDate(now.getDate() - 7);
  }
  let date = dateFormat(now, "mm/dd/yyyy");

  console.log('PRINT DATE ', date)
  var selectQuery =
    "select dateformat_date as day, sum(count) as predicted from meraki.prediction_value_table where dateformat_date >= '" + date + "'  group by dateformat_date order by dateformat_date limit 7";

  console.log("DAILY PREDICTIONS::::::", selectQuery)
  db.any(selectQuery)
    .then(function (result) {
      console.log("db select success for date ", result);
      res.status(200).send(result);
    })
    .catch(function (err) {
      console.log("not able to get connection " + err);
      res.status(500).send(JSON.stringify(err.message));
    });
});

router.get("/hourlyPredictions", function (req, res) {
  var d = new Date();
  var day = d.getDate();
  var month = d.getMonth() + 1;

  if (month < 10) {
    month = "0" + month;
  }

  if (day < 10) {
    day = "0" + day;
  }

  var year = d.getFullYear().toString().substr(-2);
  var dateString = "'" + month + "/" + day + "/" + year + "'";

  var selectQuery = "select count as predicted from meraki.prediction_value_table where dateformat_date=" + dateString;
  db.any(selectQuery)
    .then(function (result) {
      console.log("db select success for date ", result);
      res.status(200).send(result);
    })
    .catch(function (err) {
      console.log("not able to get connection " + err);
      res.status(500).send(JSON.stringify(err.message));
    });
});

router.get("/currentMonthWiseDailyPredictions", function (req, res) {
  var d = new Date();
  var month = dateFormat(d, 'mm');

  var selectQuery =
    "select dateformat_date, sum(count) as predicted from meraki.prediction_value_table where dateformat_date >= '" + month + "/01/19' and dateformat_date <= '" + month + "/31/19' group by dateformat_date order by dateformat_date;";
  db.any(selectQuery)
    .then(function (result) {
      console.log("db select success for date ", result);
      res.status(200).send(result);
    })
    .catch(function (err) {
      console.log("not able to get connection " + err);
      res.status(500).send(JSON.stringify(err.message));
    });
});

router.get("/previousMonthWiseDailyPredictions", function (req, res) {
  var d = new Date();
  var month = '0' + (dateFormat(d, 'mm') - 1).toString();
  console.log(month);

  var selectQuery =
    "select dateformat_date, sum(count) as predicted from meraki.prediction_value_table where dateformat_date >= '" + month + "/01/19' and dateformat_date <= '" + month + "/31/19' group by dateformat_date order by dateformat_date;";

  db.any(selectQuery)
    .then(function (result) {
      console.log("db select success for date ", result);
      res.status(200).send(result);
    })
    .catch(function (err) {
      console.log("not able to get connection " + err);
      res.status(500).send(JSON.stringify(err.message));
    });
});

router.get("/visitorCountByDate", function (req, res) {
  var datetime = new Date();
  let date = req.query.date || dateFormat(datetime, "yyyy-mm-dd");
  console.log("value of date ", date);

  db.any(
      "select count (distinct (person_oid)) from meraki.visitor_predictions where dateformat_date ='" +
      date +
      "' and zoneid=1"
    )
    .then(function (result) {
      console.log("db select success for date ", result);
      res.status(200).send(result);
    })
    .catch(function (err) {
      console.log("not able to get connection " + err);
      res.status(500).send(JSON.stringify(err.message));
    });
});

router.get("/currentVisitorCount", function (req, res) {
  var datetime = new Date();
  let formattedDateString = dateFormat(datetime, "yyyy-mm-dd");
  let hourValue = dateFormat(datetime, "H");

  var selectQuery =
    "SELECT COUNT(DISTINCT(person_oid)) as visitor_count" +
    " from meraki.visitor_predictions where " +
    " dateformat_date = '" +
    formattedDateString +
    "' and dateformat_hour=" +
    hourValue +
    " and dateformat_minute= (select dateformat_minute from meraki.visitor_predictions " +
    " order by datetime desc LIMIT 1 ) 	";

  console.log("CURRENT VISITORS  ", selectQuery);
  db.any(selectQuery)
    .then(function (result) {
      console.log("db select success for date ", result);
      res.status(200).send(result);
    })
    .catch(function (err) {
      console.log("not able to get connection " + err);
      res.status(500).send(JSON.stringify(err.message));
    });
});

router.get("/historicalDataByCamera", function (req, res) {
  let pattern = req.query.pattern || "today";
  if (pattern == "today") {
    var datetime = new Date();
    let date = dateFormat(datetime, "yyyy-mm-dd");
    let selectQuery =
      "SELECT CASE WHEN count(distinct(T2.person_oid)) > 0" +
      " THEN count(distinct(T2.person_oid)) ELSE 0 END as count , T1.dateformat_hour as timeRange FROM (SELECT * FROM generate_series(0,23) as dateformat_hour)as T1 " +
      " FULL OUTER  JOIN (select * from meraki.visitor_predictions where dateformat_date ='" +
      date +
      "' and zoneid = 1) as  T2 " +
      " ON  T1.dateformat_hour = T2.dateformat_hour group by T1.dateformat_hour order by T1.dateformat_hour  ";
    // db.any("select count (distinct (person_oid)), dateformat_hour  as timeRange from meraki.visitor_predictions where dateformat_date ='" + date + "' group by dateformat_hour")
    db.any(selectQuery)
      .then(function (result) {
        console.log("db select success for date ", result);
        res.status(200).send(result);
      })
      .catch(function (err) {
        console.log("not able to get connection " + err);
        res.status(500).send(JSON.stringify(err.message));
      });
  } else if (pattern == "yesterday") {
    var datetime = new Date();
    datetime.setDate(datetime.getDate() - 1);
    let date = dateFormat(datetime, "yyyy-mm-dd");

    let selectQuery =
      "SELECT CASE WHEN count(distinct(T2.person_oid)) > 0" +
      " THEN count(distinct(T2.person_oid)) ELSE 0 END as count , T1.dateformat_hour as timeRange FROM (SELECT * FROM generate_series(0,23) as dateformat_hour)as T1 " +
      " FULL OUTER  JOIN (select * from meraki.visitor_predictions where dateformat_date ='" +
      date +
      "' and zoneid = 1) as  T2 " +
      " ON  T1.dateformat_hour = T2.dateformat_hour group by T1.dateformat_hour order by T1.dateformat_hour  ";

    db.any(selectQuery)
      .then(function (result) {
        console.log("db select success for date ", result);
        res.status(200).send(result);
      })
      .catch(function (err) {
        console.log("not able to get connection " + err);
        res.status(500).send(JSON.stringify(err.message));
      });
  } else if (pattern == "this week") {
    let weekValue = dateFormat(datetime, "W");
    let yearValue = dateFormat(datetime, "yyyy");
    let selectQuery =
      " SELECT " +
      " CASE WHEN count(distinct(T2.person_oid)) > 0 THEN count(distinct(T2.person_oid)) ELSE 0 END as count,  T1.dateformat_date as timeRange " +
      " FROM (select to_char((cast(date_trunc('week', current_date) as date) + i),'YYYY-MM-DD') AS dateformat_date " +
      " from generate_series(0,6) i)as T1 " +
      " FULL OUTER  JOIN " +
      " (select * from meraki.visitor_predictions where dateformat_week =" +
      weekValue +
      " and dateformat_year =" +
      yearValue +
      " and zoneid=1) as  T2 " +
      " ON  T1.dateformat_date = T2.dateformat_date " +
      " group by T1.dateformat_date order by T1.dateformat_date ";

    console.log('THIS WEEK QUERY: ', selectQuery)
    db.any(selectQuery)
      .then(function (result) {
        console.log("db select success for date ", result);
        res.status(200).send(result);
      })
      .catch(function (err) {
        console.log("not able to get connection " + err);
        res.status(500).send(JSON.stringify(err.message));
      });
  } else if (pattern == "last week") {
    let weekValue = dateFormat(datetime, "W");
    let yearValue = dateFormat(datetime, "yyyy");

    weekValue = weekValue - 1;
    let selectQuery =
      " SELECT " +
      " CASE WHEN count(distinct(T2.person_oid)) > 0 THEN count(distinct(T2.person_oid)) ELSE 0 END as count,  T1.dateformat_date as timeRange " +
      " FROM (select to_char((cast(date_trunc('week', current_date) as date) + i-7),'YYYY-MM-DD') AS dateformat_date " +
      " from generate_series(0,6) i)as T1 " +
      " FULL OUTER  JOIN " +
      " (select * from meraki.visitor_predictions where dateformat_week =" +
      weekValue +
      " and dateformat_year =" +
      yearValue +
      "and zoneid=1 ) as  T2 " +
      " ON  T1.dateformat_date = T2.dateformat_date " +
      " group by T1.dateformat_date order by T1.dateformat_date ";
    db.any(selectQuery)
      .then(function (result) {
        console.log("db select success for date ", result);
        res.status(200).send(result);
      })
      .catch(function (err) {
        console.log("not able to get connection " + err);
        res.status(500).send(JSON.stringify(err.message));
      });
  } else if (pattern == "this month") {
    let monthValue = dateFormat(datetime, "m");
    let yearValue = dateFormat(datetime, "yyyy");
    console.log(monthValue);
    db.any(
        "SELECT CASE WHEN count(distinct(T2.person_oid)) > 0" +
        " THEN count(distinct(T2.person_oid)) ELSE 0 END as count , T1.dateformat_date as timeRange FROM (SELECT * FROM generate_series(1,31) as dateformat_date)as T1 " +
        " FULL OUTER  JOIN (select * from meraki.visitor_predictions where dateformat_month ='" +
        monthValue +
        "' and dateformat_year =" +
        yearValue + " and zoneid=1) as  T2 " +
        " ON  T1.dateformat_date = T2.dateformat_day group by T1.dateformat_date order by T1.dateformat_date  "
      )
      .then(function (result) {
        console.log("db select success for date ", result);
        res.status(200).send(result);
      })
      .catch(function (err) {
        console.log("not able to get connection " + err);
        res.status(500).send(JSON.stringify(err.message));
      });
  } else if (pattern == "last month") {
    let monthValue = dateFormat(datetime, "m");
    let yearValue = dateFormat(datetime, "yyyy");
    monthValue = monthValue - 1;
    console.log(monthValue);
    let selectQuery = "SELECT CASE WHEN count(distinct(T2.person_oid)) > 0" +
      " THEN count(distinct(T2.person_oid)) ELSE 0 END as count , T1.dateformat_date as timeRange FROM (SELECT * FROM generate_series(1,31) as dateformat_date)as T1 " +
      " FULL OUTER  JOIN (select * from meraki.visitor_predictions where dateformat_month ='" +
      monthValue +
      "' and dateformat_year =" +
      yearValue + " and zoneid=1) as  T2 " +
      " ON  T1.dateformat_date = T2.dateformat_day group by T1.dateformat_date order by T1.dateformat_date  ";

    console.log('LAST MONTH QUERY: ', selectQuery);
    db.any(
        selectQuery
      )
      .then(function (result) {
        console.log("db select success for date ", result);
        res.status(200).send(result);
      })
      .catch(function (err) {
        console.log("not able to get connection " + err);
        res.status(500).send(JSON.stringify(err.message));
      });
  }
});

function _datasetGeneration(dbInsertCamData) {
  return new Promise(function (fulfill, reject) {
    var insertQueryForDB =
      "INSERT INTO meraki.visitor_data_without_oid " +
      "(visitor_count," +
      "datetime, " +
      "dateformat_date," +
      "dateformat_year, " +
      "dateformat_month," +
      "dateformat_week, " +
      "dateformat_day, " +
      "dateformat_hour, " +
      "dateformat_minute," +
      "day_of_week" +
      ")" +
      " VALUES (" +
      dbInsertCamData.visitor_count +
      "," +
      dbInsertCamData.ts +
      ",'" +
      dbInsertCamData.dateFormat_date +
      "'," +
      dbInsertCamData.dateFormat_year +
      "," +
      dbInsertCamData.dateFormat_month +
      "," +
      dbInsertCamData.dateFormat_week +
      "," +
      dbInsertCamData.dateFormat_day +
      "," +
      dbInsertCamData.dateFormat_hour +
      "," +
      dbInsertCamData.dateFormat_minute +
      ",'" +
      dbInsertCamData.day_of_week +
      "')";

    db.none(insertQueryForDB)
      .then(function (response) {
        console.log(
          "db insert success for oid  ",
          dbInsertCamData.visitor_count
        );
        fulfill(response);
      })
      .catch(function (err) {
        console.log("not able to get connection " + err);
        reject(err);
      });
  });
}

router.post("/datasetnew", function (req, res) {
  var responseObject = {};
  var dataList = [];
  let dateValue = req.body.tsValue;
  let incrementalValue = req.body.incremental;

  var gen1 = rn.generator({
    min: 0,
    max: 1,
    integer: true
  });

  var gen2 = rn.generator({
    min: 10 + incrementalValue,
    max: 25 + incrementalValue,
    integer: true
  });

  var gen3 = rn.generator({
    min: 50 + incrementalValue,
    max: 60 + incrementalValue,
    integer: true
  });

  var gen1WE = rn.generator({
    min: 0,
    max: 1,
    integer: true
  });

  var gen2WE = rn.generator({
    min: 30 + incrementalValue,
    max: 45 + incrementalValue,
    integer: true
  });

  var gen3WE = rn.generator({
    min: 80 + incrementalValue,
    max: 90 + incrementalValue,
    integer: true
  });

  var datetime = new Date(dateValue);
  let ts = datetime.getTime();
  let formattedDateString = dateFormat(datetime, "yyyy-mm-dd");
  let yearValue = dateFormat(datetime, "yyyy");
  let monthValue = dateFormat(datetime, "m");
  let weekValue = dateFormat(datetime, "W");
  let dayValue = dateFormat(datetime, "d");
  let hourValue = dateFormat(datetime, "H");
  let minuteValue = dateFormat(datetime, "M");
  let dayStringValue = dateFormat(datetime, "dddd");

  console.log("DAY OF THE WEEK ", dayStringValue);
  console.log("HOUR OF THE DAY IS ", hourValue);

  let dbInsertCamData = {};
  dbInsertCamData.ts = ts;
  dbInsertCamData.dateFormat_date = formattedDateString;
  dbInsertCamData.dateFormat_year = yearValue;
  dbInsertCamData.dateFormat_month = monthValue;
  dbInsertCamData.dateFormat_week = weekValue;
  dbInsertCamData.dateFormat_day = dayValue;
  dbInsertCamData.dateFormat_hour = hourValue;
  dbInsertCamData.dateFormat_minute = minuteValue;

  let countOfVisitors = 0;

  if (dayStringValue === "Sunday" || dayStringValue === "Saturday") {
    if (hourValue == 18 || hourValue == 19) {
      countOfVisitors = gen3WE();
    } else if (hourValue >= 23 || hourValue <= 7) {
      countOfVisitors = 0;
    } else {
      countOfVisitors = gen2WE();
    }
  } else {
    if (hourValue == 18 || hourValue == 19) {
      countOfVisitors = gen3();
    } else if (hourValue >= 23 || hourValue <= 7) {
      countOfVisitors = 0;
    } else {
      countOfVisitors = gen2();
    }
  }

  dbInsertCamData.visitor_count = countOfVisitors * 10;

  _datasetGeneration(dbInsertCamData);
  dataList.push(dbInsertCamData);
  responseObject.status = "SUCCESS";
  res.status(200).send(responseObject);
});

module.exports = router;