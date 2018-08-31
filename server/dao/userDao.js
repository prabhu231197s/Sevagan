(function () {

    var connection = require('../configs/dbConfig');

    module.exports.registerDonor = function (donor, callback) {
        try{
            var query = "INSERT into donors set ?";
            connection.query(query,donor,function (err, data) {
                callback(err,data);
            });
        }
        catch(err){
            callback(err);
        }
    };

    module.exports.mapDonorToken = function (map, callback) {
        try{
            var query = "INSERT into donortokenmap set ?";
            connection.query(query,map,function (err, data) {
                callback(err,data);
            });
        }
        catch(err){
            callback(err);
        }
    };

    module.exports.verifyDonor = function (body, callback) {
        try{
            var query = "SELECT * from donortokenmap where email=?";
            connection.query(query,[body.email],function (err, data) {
                if(err){
                    callback(err);
                }
                else{
                    if(data.length>0){
                        var token = data[0].token;
                        if(token === body.token){
                            callback(null,true);
                        }
                        else{
                            callback({message:"Invalid Token"});
                        }
                    }
                    else{
                        callback({message:"Invalid User"});
                    }
                }
            });
        }
        catch(err){
            callback(err);
        }
    };

    module.exports.updateFlag = function (email, callback) {
        try{
            var query = "UPDATE donors set verified=1 where email=?";
            connection.query(query,[email],function (err, data) {
                callback(err,data);
            });
        }
        catch(err){
            callback(err);
        }
    };

    module.exports.fetchToken = function (email, callback) {
        try{
            var query = "SELECT * from donortokenmap where email=?";
            connection.query(query,[email],function (err, data) {
                callback(err,data);
            });
        }
        catch(err){
            callback(err);
        }
    };

    module.exports.login = function (email, password, callback) {
        try{
            var query = "SELECT * from donors where email=?";
            connection.query(query,[email],function (err, data) {
                if(err){
                    callback(err);
                }
                else{
                    if(data.length>0){
                        console.log(1);
                        console.log(data[0]);
                        var user = data[0];
                        user.type = 1;
                        console.log(user);
                        callback(null,user);
                    }
                    else{
                        var query = "SELECT * from bloodbanks where email=?";
                        connection.query(query,[email],function (err, data) {
                            if(err){
                                callback(err);
                            }
                            else{
                                if(data.length>0){
                                    var user = data[0];
                                    user.type = 2;
                                    callback(null,user);
                                }
                                else{
                                    var query  = "SELECT * from hospitals where email=?";
                                    connection.query(query,[email],function (err, data) {
                                        if(err){
                                            callback(err);
                                        }
                                        else{
                                            if(data.length>0){
                                                var user = data[0];
                                                user.type = 3;
                                                callback(null,user);
                                            }
                                            else{
                                                callback({message:"Error"});
                                            }
                                        }
                                    })
                                }
                            }
                        });
                    }
                }
            });
        }
        catch (err){
            callback(err);
        }
    };


    module.exports.getRequests = function (callback) {
        try{
            var query = "SELECT * from requests r join bloodgroups b on b.id=r.bloodgroup";
            connection.query(query,function (err, data) {
                callback(err,data);
            });
        }
        catch(err){
            callback(err);
        }
    }

})();