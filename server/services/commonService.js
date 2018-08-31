(function () {
    var connection = require('../configs/dbConfig');
    var tokenGenerator = require('voucher-code-generator');
    var saltRounds = 10;
    var commonDao = require('../dao/commonDao');
    var bcrypt = require('bcrypt');
    var transformer = require('../helpers/transformer');
    var each = require('sync-each');
    var smsService = require('../services/smsService');


    module.exports.beginTransaction = function (callback) {
        try{
            connection.beginTransaction(function(err){
                callback(err);
            });
        }
        catch(err){
            callback(err);
        }
    };

    module.exports.rollback = function(callback){
        try{
            connection.rollback(function(err){
                callback(err);
            });
        }
        catch(err){
            callback(err);
        }
    };

    module.exports.commit = function(callback){
        try{
            connection.commit(function(err){
                callback(err);
            });
        }
        catch(err){
            callback(err);
        }
    };

    module.exports.generateToken = function (length, prefix, callback) {
        try{
            var token = tokenGenerator.generate({
                length : length,
                count : 1,
                charset : tokenGenerator.charset("alphanumeric"),
                prefix : prefix
            }).toString().toUpperCase();
            if(token){
                callback(null,token);
            }
            else{
                callback({message:"Error generating token"});
            }
        }
        catch(err){
            callback(err);
        }
    };

    module.exports.generateHash = function (password,callback) {
        try{
            bcrypt.hash(password,saltRounds,function (err, hash) {
                if(err){
                    callback(err);
                }
                else{
                    callback(null,hash);
                }
            });
        }
        catch(err){
            callback(err);
        }
    };

    module.exports.checkHash = function (pass,password, callback) {
        try{
            bcrypt.compare(pass,password,function (err, result) {
                if(err){
                    callback({message:"Something went wrong"});
                }
                else{
                    if(result === true){
                        callback(null,result);
                    }
                    else{
                        callback({message:"Invalid Password",statusCode:420});
                    }
                }
            })
        }
        catch(err){
            callback(err);
        }
    };


    module.exports.raiseRequest = function (param, callback) {
        commonDao.raiseRequest(param,callback);
    };

    module.exports.fetchDonors = function (bloodgroup,callback) {
        commonDao.fetchDonors(bloodgroup,callback);
    };

    module.exports.fetchBanks = function (callback) {
        commonDao.fetchBanks(callback);
    };

    module.exports.getBloodGroups = function (callback) {
        commonDao.getBloodGroups(callback);
    };

    module.exports.fetchContact = function (sevaganId, callback) {
        commonDao.fetchConact(sevaganId,callback);
    };
    
    module.exports.sendNotifications = function (phone,contact,callback) {
        var flag=0;
        console.log(phone);
        each (phone,function (number, next) {
            smsService.sendSms(number,contact,function (err, data) {
                if(err){
                    flag = flag+1;
                }
                else{
                    console.log('success notification');
                }
            });
            next(null,number);
        },function (err, transform) {
            if(err){
                callback(err);
            }
            else{
                if(flag === phone.length){
                    callback({message:"Something 1"});
                }
                else{
                    callback(null,{message:"Success"});
                }
            }
        });
    };

    module.exports.addFoodRequest = function (request, callback) {
        commonDao.addFoodRequest(request,callback);
    };

    module.exports.getUsersContact = function (location, callback) {
        commonDao.getUsersContact(location,callback);
    };

    module.exports.getFood = function (callback) {
        commonDao.getFood(callback);
    };

    module.exports.notifyFood = function (details,callback) {
        commonDao.notifyFood(details,callback);
    }

})();