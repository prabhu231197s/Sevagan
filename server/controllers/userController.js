(function () {

    var userService = require('../services/userService');
    var responseHandler = require('../helpers/responseHandler');
    var validator = require('../helpers/validator');
    var transformer = require('../helpers/transformer');
    var commonService = require('../services/commonService');
    var mailService = require('../services/mailService');
    var transactionHandler = require('../helpers/transactionHandler');

    module.exports.registerDonor = function (req, res) {
        try{
            if(req.body.donor){
                var donor = req.body.donor;
                validator.nullCheck(donor,function (err, result) {
                    if(err){
                        responseHandler.error(res,err);
                    }
                    else{
                        if(result===true){
                            transformer.geocode(donor.location,donor.address,function (err, encodedData) {
                                if(err){
                                    responseHandler.error(res,err);
                                }
                                else{
                                    var latitude = encodedData.latitude;
                                    var longitude = encodedData.longitude;
                                    delete donor.address;
                                    delete donor.location;
                                    donor.latitude = latitude;
                                    donor.longitude = longitude;
                                    commonService.generateToken(10,"DO-",function (err, donorId) {
                                        if(err){
                                            responseHandler.error(res,err);
                                        }
                                        else{
                                            donor.sevaganId = donorId;
                                            commonService.generateHash(donor.password,function (err, hash) {
                                                if(err){
                                                    responseHandler.error(res,err);
                                                }
                                                else{
                                                    donor.password = hash;
                                                    commonService.beginTransaction(function (err) {
                                                        if(err){
                                                            responseHandler.error(res,err);
                                                        }
                                                        else{
                                                            userService.registerDonor(donor,function (err, data) {
                                                                if(err){
                                                                    transactionHandler.rollbackHandler(res,err);
                                                                }
                                                                else{
                                                                    commonService.generateToken(6,"",function (err, token) {
                                                                        if(err){
                                                                            transactionHandler.rollbackHandler(res,err);
                                                                        }
                                                                        else{
                                                                            var map = {};
                                                                            map.email = donor.email;
                                                                            map.token = token;
                                                                            userService.mapDonorToken(map,function (err, data) {
                                                                                if(err){
                                                                                    transactionHandler.rollbackHandler(res,err);
                                                                                }
                                                                                else{
                                                                                    /*mailService.sendMail(token,donorId,donor.email,function (err, data) {
                                                                                        if(err){
                                                                                            transactionHandler.rollbackHandler(res,err);
                                                                                        }
                                                                                        else{
                                                                                            responseHandler.response(res,data);
                                                                                        }
                                                                                    });*/
                                                                                    transactionHandler.commitHandler(res,data);
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                        else{
                            responseHandler.error(res,{message:"Something went wrong"});
                        }
                    }
                });
            }
            else{
                responseHandler.error(res,{message:"Empty body",statusCode:400});
            }
        }
        catch(err){
            responseHandler.error(res,err);
        }
    };


    module.exports.verifyDonor = function (req, res) {
        if(req.body.email && req.body.token){
            userService.verifyDonor(req.body,function (err, result) {
                if(err){
                    responseHandler.error(res,err);
                }
                else{
                    if(result===true){
                        userService.updateFlag(req.body.email,function (err, data) {
                            if(err){
                                responseHandler.error(res,err);
                            }
                            else{
                                responseHandler.response(res,{message:"Success"});
                            }
                        });
                    }
                    else{
                        responseHandler.error(res,{message:"Something went wrong"});
                    }
                }
            });
        }
        else{
            responseHandler.error(res,{message:"Empty body",statusCode:400});
        }
    };

    module.exports.resendDonorToken = function (req, res) {
        try{
            if(req.body.email){
                userService.fetchToken(req.body.email,function (err, data) {
                    if(err){
                        responseHandler.error(res,err);
                    }
                    else{
                        if(data.length>0){
                            var token = data[0].token;
                            mailService.ack(token,req.body.email,function (err, data) {
                                if(err){
                                    responseHandler.error(res,err);
                                }
                                else{
                                    responseHandler.response(res,data);
                                }
                            });
                        }
                        else{
                            responseHandler.error(res,{message:"Invalid User"});
                        }
                    }
                });
            }
            else{
                responseHandler.error(res,{message:"Specify mail id",statusCode:400});
            }
        }
        catch (err){
            responseHandler.error(res,err);
        }
    };


    module.exports.raiseBloodRequest = function (req, res) {
        try{
            console.log(req.body);
            if(req.body.request){
                var request = req.body.request;
                validator.nullCheck(request,function (err, result) {
                    if(err){
                        responseHandler.error(res,err);
                    }
                    else{
                        if(result===true){
                            commonService.raiseRequest(request,function (err, data) {
                                if(err){
                                    responseHandler.error(res,err);
                                }
                                else{
                                    var details = [];
                                    var contact = req.body.phone;
                                    var origin = request.latitude+","+request.longitude;
                                    commonService.fetchDonors(request.bloodgroup,function (err, donors) {
                                        if(err){
                                            responseHandler.error(res,err);
                                        }
                                        else{
                                            console.log(donors);
                                            commonService.fetchBanks(function (err, banks) {
                                                if(err){
                                                    responseHandler.error(res,err);
                                                }
                                                else{
                                                    transformer.conv(donors,banks,function (err, detail) {
                                                        if(err){
                                                            responseHandler.error(res,err);
                                                        }
                                                        else{
                                                            details = detail;
                                                            transformer.getResultant(req.body.threshold,origin,details,function (err, data) {
                                                                if(err){
                                                                    responseHandler.error(res,err);
                                                                }
                                                                else{
                                                                    var phone = data.c;
                                                                    commonService.sendNotifications(phone,contact,function (err, resdata) {
                                                                        if(err){
                                                                            responseHandler.error(res,err);
                                                                        }
                                                                        else{
                                                                            console.log(data.r);
                                                                            responseHandler.response(res,data.r);
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                        else{
                            responseHandler.error({message:"Something went wrong"});
                        }
                    }
                })
            }
            else{
                responseHandler.error(res,{message:"Empty Body",statusCode:400});
            }
        }
        catch(err){
            responseHandler.error(res,err);
        }
    };

    module.exports.expandRadius = function (req, res) {
        try{
            if(req.body.request){
                var request = req.body.request;
                validator.nullCheck(request,function (err, result) {
                    if(err){
                        responseHandler.error(res,err);
                    }
                    else{
                        if(result===true){
                            var details = [];
                            var contact = req.body.phone;
                            var origin = request.latitude+","+request.longitude;
                            commonService.fetchDonors(req.body.bloodgroup,function (err, donors) {
                                if(err){
                                    responseHandler.error(res,err);
                                }
                                else{
                                    console.log(donors);
                                    commonService.fetchBanks(function (err, banks) {
                                        if(err){
                                            responseHandler.error(res,err);
                                        }
                                        else{
                                            transformer.conv(donors,banks,function (err, detail) {
                                                if(err){
                                                    responseHandler.error(res,err);
                                                }
                                                else{
                                                    details = detail;
                                                    transformer.getResultant(req.body.threshold,origin,details,function (err, data) {
                                                        if(err){
                                                            responseHandler.error(res,err);
                                                        }
                                                        else{
                                                            var phone = data.c;
                                                            commonService.sendNotifications(phone,contact,function (err, resdata) {
                                                                if(err){
                                                                    responseHandler.error(res,err);
                                                                }
                                                                else{
                                                                    responseHandler.response(res,data.r);
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                        else{
                            responseHandler.error({message:"Something went wrong"});
                        }
                    }
                })
            }
            else{
                responseHandler.error(res,{message:"Empty Body",statusCode:400});
            }
        }
        catch(err){
            responseHandler.error(res,err);
        }
    };

    module.exports.addFoodRequest = function (req, res) {
        try{
            if(req.body){
                var request = req.body;
                var location = req.body.location;
                commonService.addFoodRequest(request,function (err, data) {
                    if(err){
                        responseHandler.error(res,err);
                    }
                    else{
                        commonService.getUsersContact(location,function (err, data) {
                            if(err){
                                responseHandler.error(res,err);
                            }
                            else{
                                commonService.notifyFood(data,function (err, data) {
                                    if(err){
                                        responseHandler.error(res,err);
                                    }
                                    else{
                                        responseHandler.response(res,data);
                                    }
                                })
                            }
                        });
                    }
                });
            }
            else{
                responseHandler.error(res,{message:"Empty json"});
            }
        }
        catch(err){
            responseHandler.error(res,err);
        }
    };


    module.exports.login = function (req, res) {
        try{
            var email = req.body.email;
            var password = req.body.password;
            userService.login(email,password,function (err, data) {
                if(err){
                    responseHandler.error(res,err);
                }
                else{
                    if(data){
                        responseHandler.response(res,data);
                    }
                    else{
                        responseHandler.error(res,{message:"Something 2"});
                    }
                }
            });
        }
        catch(err){
            responseHandler.error(res,err);
        }
    };

    module.exports.getRequests = function (req, res) {
        try{
            userService.getRequests(function (err, data) {
                if(err){
                    responseHandler.error(res,err);
                }
                else{
                    responseHandler.response(res,data);
                }
            });
        }
        catch(err){
            responseHandler.error(res,err);
        }
    };

    module.exports.getFood = function (req, res) {
        try{
            commonService.getFood(function (err, data) {
                if(err){
                    responseHandler.error(res,err);
                }
                else{
                    responseHandler.response(res,data);
                }
            });
        }
        catch(err){
            responseHandler.error(res,err);
        }
    }

})();