(function () {

    var connection = require('../configs/dbConfig');
    var each = require('sync-each');
    var smsService = require('../services/smsService');

    module.exports.raiseRequest = function (param, callback) {
        try{
            var query = "INSERT into requests set ?";
            connection.query(query,param,function (err, data) {
                callback(err,data);
            });
        }
        catch(err){
            callback(err);
        }
    };

    module.exports.fetchDonors = function (bloodgroup,callback) {
        try{
            var query = "SELECT name,phone,latitude,longitude from donors where bloodgroup=?";
            connection.query(query,[bloodgroup],function (err, data) {
                callback(err,data);
            });
        }
        catch(err){
            callback(err);
        }
    };

    module.exports.fetchBanks = function (callback) {
        try{
            var query = "SELECT name,phone,latitude,longitude from bloodbanks";
            /*connection.query(query,function (err, data) {
                callback(err,data);
            })*/
            callback(null,[]);
        }
        catch(err){
            callback(err);
        }
    };

    module.exports.getBloodGroups = function (callback) {
        try{
            var query = "SELECT * from bloodgroups";
            connection.query(query,function (err, data) {
                callback(err,data);
            });
        }
        catch (err){
            callback(err);
        }
    };

    module.exports.fetchContact = function (sevaganId, callback) {
        try{
            var query = "SELECT * from ";
        }
        catch(err){
            callback(err);
        }
    };

    module.exports.addFoodRequest = function (request, callabck) {
        try{
            var query = "INSERT into foodrequest set ?";
            connection.query(query,request,function (err, data) {
                callabck(err,data);
            })
        }
        catch(err){
            callabck(err);
        }
    };

    module.exports.getFood = function (callback) {
        try{
            var query = "SELECT name,parcel,latitude,longitude,phone,location from foods";
            connection.query(query,function (err, data) {
                callback(err,data);
            });
        }
        catch(err){
            callback(err);
        }
    };

    module.exports.getUsersContact = function (location, callback) {
        try{
            var query = "SELECT phone from donors where location=?";
            connection.query(query,[location],function (err, data) {
                callback(err,data);
            });
        }
        catch(err){
            callback(err);
        }
    };

    module.exports.notifyFood = function (details,callback) {
        try{
            each(details,function (number, next) {
                smsService.sendSms(number,'',function (err, data) {
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log('Success');
                    }
                });
                next(null,number);
            },function (err, transform) {
                callback(null,{message:"Success"});
            });
        }
        catch(err){
            callback(err);
        }
    }

})();