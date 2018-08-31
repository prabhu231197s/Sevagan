(function () {

    var _ = require('underscore');
    var configs = require('../configs/config.json');
    var coder  = require('node-geocoder');
    var geocoder = coder(configs.options);
    var each = require('sync-each');
    var distance = require('google-distance-matrix');
    distance.key('AIzaSyC40XVdIU1QqSXEM5TXLZTsoipgGRzUZNw');
    distance.units('imperial');

    module.exports.geocode = function (location, address, callback) {
        try{
            geocoder.geocode(address,function (err, data) {
                if(err){
                    callback(err);
                }
                else{
                    if(data.length === 0){
                        geocoder.geocode(location,function (err, data) {
                            if(err){
                                callback(err);
                            }
                            else{
                                if(data.length>0){
                                    var resp = {};
                                    resp.latitude = data[0].latitude;
                                    resp.longitude = data[0].longitude;
                                    callback(null,resp);
                                }
                                else{
                                    callback({message:"Sorry We are not there yet"});
                                }
                            }
                        });
                    }
                    else{
                        var resp = {};
                        resp.latitude = data[0].latitude;
                        resp.longitude = data[0].longitude;
                        callback(null,resp);
                    }
                }
            });
        }
        catch(err){
            callback(err);
        }
    };


    module.exports.conv = function (donors, banks, callback) {
        try{
            var details = [];
            each(donors,function (item, next) {
                details.push(item);
                next(null,item);
            },function (err, transform) {
                console.log(details);
                each(banks,function (bank, next) {
                    details.push(bank);
                    next(null,bank);
                },function (err, transform) {
                    console.log(details);
                    callback(null,details);
                });
            });
            /*_.forEach(donors,function (item, index) {
                console.log(index);
                details.push(item);
                console.log(details);
                if((donors.length) === (details.length)){
                    _.forEach(banks,function (bank, inde) {
                        console.log(2);
                        details.push(bank);
                        if(banks.length === (inde)){
                            console.log(details);
                            callback(null,details);
                        }
                    });
                }
            });*/
        }
        catch(err){
            callback(err);
        }
    };

    module.exports.getResultant = function (threshold,origin,details, callback) {
        try{
            var resultant = [];
            var d = 0;
            var contact = [];
            var destinations = [];
            var origins = [];
            destinations.push(origin);
            each(details,function (detail,next) {
                var destination = detail.latitude+","+detail.longitude;
                origins.push(destination);
                next(null,detail);
            },function (err, trans) {
                console.log(origins);
            });
            distance.matrix(origins,destinations,function (err, distances) {
                if (err) {
                    console.log(err);
                }
                if(!distances) {
                    console.log('no distances');
                }
                if (distances.status === 'OK') {
                    console.log(origins.length);
                    for (var i=0; i < origins.length; i++) {
                        for (var j = 0; j < destinations.length; j++) {
                            var origin = distances.origin_addresses[i];
                            var destination = distances.destination_addresses[j];
                            if (distances.rows[0].elements[j].status === 'OK') {
                                var distance = distances.rows[i].elements[j].distance.value;
                                console.log('Distance from ' + origin + ' to ' + destination + ' is ' + distance);
                                d = distance;
                            } else {
                                console.log(destination + ' is not reachable by land from ' + origin);
                            }
                            console.log(threshold);
                            console.log(d);
                            if(d<threshold){
                                resultant.push(details[i]);
                                contact.push(details[i].phone);
                            }
                        }
                    }
                    callback(null,{r: resultant,c: contact});
                }
            });
        }
        catch(err){
            callback(err);
        }
    };

    function dm(d,detail, threshold,origins, destinations, callback) {
        var resultant = [];
        var contact = [];
        var flag = 0;

        distance.matrix(origins, destinations, function (err, distances) {
            if (err) {
                console.log(err);
            }
            if(!distances) {
                console.log('no distances');
            }
            if (distances.status === 'OK') {
                for (var i=0; i < origins.length; i++) {
                    for (var j = 0; j < destinations.length; j++) {
                        var origin = distances.origin_addresses[i];
                        var destination = distances.destination_addresses[j];
                        if (distances.rows[0].elements[j].status === 'OK') {
                            var distance = distances.rows[i].elements[j].distance.value;
                            d = distance+d;
                            console.log('Distance from ' + origin + ' to ' + destination + ' is ' + distance);
                            console.log(d);
                        } else {
                            console.log(destination + ' is not reachable by land from ' + origin);
                        }
                    }
                }
            }
        });

    }

})();