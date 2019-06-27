var express = require("express");
var router = express.Router();
var config = require("config");
var promise = require("bluebird");
var dbOptions = {
    // Initialization Options
    promiseLib: promise
};
var pgp = require("pg-promise")(dbOptions);

var connectionString = "postgres://" + config.get("environment.merakiConfig.dbUserName") + ":" +
    config.get("environment.merakiConfig.dbPassword") + "@db:" + config.get("environment.merakiConfig.dbPort") +
    "/" + config.get("environment.merakiConfig.dbName");
var db = pgp(connectionString);


/*Simulate the AP and it's associtated clients informations*/
router.post("/generateApClientMap", function (req, res) {

    var apDeviceCountMap = new Map();
    let apclients = req.body.data;
    apclients.forEach(apclientDetails => {
        apDeviceCountMap.set(apclientDetails.apMacAddr, apclientDetails.numberOfClients);
    });
    var scanningApClients = JSON.stringify(_apClientMap(apDeviceCountMap));
    console.log(scanningApClients);
    res.status(200).send(scanningApClients);
});



/*Simulate the AP and it's associtated clients informations*/
router.post("/generate", function (req, res) {

    var apDeviceCountMap = new Map();
    let apclients = req.body.data;
    apclients.forEach(apclientDetails => {
        apDeviceCountMap.set(apclientDetails.apMacAddr, apclientDetails.numberOfClients);
    });
    var scanningApClients = JSON.stringify(_generateClients(apDeviceCountMap));
    console.log(scanningApClients);
    res.status(200).send(scanningApClients);
});
var client_macs = [], ip_count = 0, thirdDigit = 0;
var device_list;

function _generateClients(apDeviceCountMap) {

    device_list = [
        { "os": "Android", "manufacturer": "Samsung" },
        { "os": "iOS", "manufacturer": "Apple" },
        { "os": "macOS", "manufacturer": "Apple" },
        { "os": "Windows", "manufacturer": "Lenovo" },
        { "os": "Linux", "manufacturer": "Nest" },
        { "os": "Linux", "manufacturer": "Amazon" },
    ];

    var iterator = apDeviceCountMap[Symbol.iterator]();
    var data = [];
    var finalJSON = {};
    for (let item of iterator) {
        var num_clients = item[1];
        var apMacAddr = item[0];
        generate_client_macs(num_clients);
        var tempData = {};
        tempData["apFloors"] = [];
        tempData["apMac"] = apMacAddr;
        tempData["apTags"] = [];
        tempData["observations"] = client_macs;
        data.push(tempData);
        client_macs = [];
    }
    finalJSON["data"] = data;
    return finalJSON;

}

function _apClientMap(apDeviceCountMap) {
    var dbInsertArray = [];
    var iterator = apDeviceCountMap[Symbol.iterator]();
    var totalUniqueVisitors = 0;
    for (let item of iterator) {
        var num_clients = item[1];
        if (num_clients > 2) {
            totalUniqueVisitors = totalUniqueVisitors + num_clients - 2;
        }
        generate_client_ap_array(num_clients, dbInsertArray, item[0]);
    }
    /* First two clients are hardcoded, more than 2 will be randomly generated as unique clients
  This logic is done to have at least 2 repeated clients  */
    totalUniqueVisitors = totalUniqueVisitors + 2;

    _performDbInsertForVisitorCount(totalUniqueVisitors);
    return dbInsertArray;

}
function generate_client_ap_array(num_clients, dbInsertArray, apMac) {

    /* First two clients are hardcoded, more than 2 will be randomly generated as unique clients
    This logic is done to have at least 2 repeated clients  */
    if (num_clients > 2) {
        for (client = 1; client <= num_clients; client++) {

            let dbInsertObject = {};
            dbInsertObject.apMacAddress = apMac;
            if (client === 1) {
                dbInsertObject.clientMacAddress = config.get("simulator.scanning.client_mac_1");
            } else if (client === 2) {
                dbInsertObject.clientMacAddress = config.get("simulator.scanning.client_mac_2");
            }
            else {
                var client_mac = "";
                for (mac_part = 0; mac_part < 6; mac_part++) {
                    var alphabet = "0123456789abcdef";
                    var emptyString = "";
                    while (emptyString.length < 2) {
                        emptyString += alphabet[Math.floor(Math.random() * alphabet.length)];
                    }
                    client_mac += emptyString;
                    if (mac_part < 5) {
                        client_mac += ":"
                    } else {

                        dbInsertObject.clientMacAddress = client_mac;
                    }
                }

            }

            let rssiValue = getRandomInt(25, 120);
            dbInsertObject.rssi = rssiValue;
            dbInsertObject.seenEpoch = (new Date).getTime();
            dbInsertArray.push(dbInsertObject);
        }
    }
    else {
        /* First two clients are hardcoded, more than 2 will be randomly generated as unique clients
  This logic is done to have at least 2 repeated clients  */
        for (client = 1; client <= num_clients; client++) {
            let dbInsertObject = {};
            dbInsertObject.apMacAddress = apMac;
            if (client === 1) {
                dbInsertObject.clientMacAddress = config.get("simulator.scanning.client_mac_1");
            }
            else {
                dbInsertObject.clientMacAddress = config.get("simulator.scanning.client_mac_2");
            }
            let rssiValue = getRandomInt(25, 120);
            dbInsertObject.rssi = rssiValue;
            dbInsertObject.seenEpoch = (new Date).getTime();
            dbInsertArray.push(dbInsertObject);
        }
    }


}


function generate_client_macs(num_clients) {

    for (client = 1; client <= num_clients; client++) {
        var client_mac = "";
        for (mac_part = 0; mac_part < 6; mac_part++) {
            var alphabet = "0123456789abcdef";
            var emptyString = "";
            while (emptyString.length < 2) {
                emptyString += alphabet[Math.floor(Math.random() * alphabet.length)];
            }
            client_mac += emptyString;
            if (mac_part < 5) {
                client_mac += ":"
            } else {
                var associated = getRandomInt(0, 1);
                var ipv4 = "None";
                var ssid = "None";
                if (associated === 1) {
                    ipv4 = "192.168." + thirdDigit + "." + (ip_count++);
                    if (ip_count > 254) {
                        thirdDigit++;
                        ip_count = 0;
                        ipv4 = "192.168." + thirdDigit + "." + (ip_count++);
                    }
                    ssid = "SimulatorWifi";
                }
                var latAndLong = generateRandomPoint({ 'lat': 24.23, 'lng': 23.12 }, 1000);
                var deviceDetails = device_list[getRandomInt(0, device_list.length - 1)];
                let rssiValue = getRandomInt(25, 120);
                client_macs.push({
                    "client_mac": client_mac,
                    "ipv4": ipv4,
                    "ipv6": "None",
                    "location": {
                        "lat": latAndLong.lat,
                        "lng": latAndLong.lng,
                        "unc": getRandomUNC(0, 10),
                        "x": [],
                        "y": [],
                    },
                    "manufacturer": deviceDetails.manufacturer,
                    "os": deviceDetails.os,
                    "rssi": rssiValue,
                    "seenEpoch": (new Date).getTime(),
                    "seenTime": new Date(),
                    "ssid": ssid
                });
            }
        }
    }
}

function generateRandomPoint(center, radius) {
    var x0 = center.lng;
    var y0 = center.lat;
    // Convert Radius from meters to degrees.
    var rd = radius / 111300;

    var u = Math.random();
    var v = Math.random();

    var w = rd * Math.sqrt(u);
    var t = 2 * Math.PI * v;
    var x = w * Math.cos(t);
    var y = w * Math.sin(t);

    var xp = x / Math.cos(y0);

    // Resulting point.
    return { 'lat': y + y0, 'lng': xp + x0 };
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomUNC(min, max) {
    return Math.random() * (max - min) + min;
}


function _performDbInsertForVisitorCount(totalUniqueVisitors) {

    var datetime = new Date();
    
    var insertQueryForVisitorCount = "INSERT INTO meraki.scanning_visitorinfo "
    + "(datetime,"
    + "visitor_count) values ('"
    + datetime.getTime()+"',"
    + totalUniqueVisitors+")"
	return new Promise(function (fulfill, reject) {
		db.none(insertQueryForVisitorCount)
			.then(function (response) {
				console.log("db insert success for timestamp ", datetime);
				fulfill(response);
			})
			.catch(function (err) {
				console.log("not able to get connection " + err);
				reject(err);
			});
	});
}

module.exports = router;