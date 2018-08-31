(function () {
    var express = require('express');
    var router = express.Router();
    var commonRoutes = require('../controllers/commonController');
    var coder = require('node-geocoder');
    var distance = require('google-distance-matrix');
    var each = require('sync-each');


    router.get('/test',function (req, res) {
        var d=0;
        var origins = [ '13.0826802,80.2707184','13.0011774,80.2564957','13.0223602,80.2194985','13.0102357,80.21565100000001','12.9229153,80.12745579999999','11.4608589,78.18580539999999' ];
        var destinations = [ '13.0102357,80.215651' ];

        distance.key('AIzaSyC40XVdIU1QqSXEM5TXLZTsoipgGRzUZNw');
        distance.units('imperial');

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
                res.status(200).json(distances);
            }
        });
    });

    router.get('/test2',function (req, res) {
        var items = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
        each(items,function (item, next) {
            item = item+1;
            next(null,item);
        },function (err, transform) {
            console.log(transform);
        });
    });

    router.get('/test3',function (req, res) {
        var options = {
            provider: 'google',
            httpAdapter: 'https',
            apiKey: 'AIzaSyC40XVdIU1QqSXEM5TXLZTsoipgGRzUZNw',
            formatter: null
        };
        var geocoder = coder(options);
        geocoder.geocode(req.query.place,function (err, res) {
            console.log(res);
        })
    });


    router.get('/get/bloodgroups',function (req, res) {
        commonRoutes.getBloodGroups(req,res);
    });



    module.exports = router;
})();