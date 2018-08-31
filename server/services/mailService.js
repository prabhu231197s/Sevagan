(function () {

    var transport = require('../configs/mailConfig');

    module.exports.sendMail = function(token,donorId,mail,callback){
        try{
            var mail = {
                from: "Sevagan Team",
                to: mail,
                subject:"Registration Token for event",
                text:"Use the token "+token+" to complete the registration process. Your donorID is "+donorId
            };
            transport.sendMail(mail,function (err, data) {
                callback(err,data);
            });
        }
        catch(err){
            callback(err);
        }
    };

    module.exports.ack = function (token,mail, callback) {
        try{
            var email = {
                from : "Sevagan Team",
                to : mail,
                subject : "Verification Token",
                text : "Your verification code is "+token
            };

            transport.sendMail(email,function(err,data){
                callback(err,data);
            });
        }
        catch (err){
            callback(err);
        }
    };

    module.exports.sendReferral = function (token, mail, callback) {
        try{
            var email = {
                from : "Civilization 2k18",
                to : mail,
                subject : "Acknowledgement for registering as Student Ambassador",
                text : "Thank you for registering as student ambassador. Refer more to earn more points. Your referral code is "+"'"+token+"'"
            };

            transport.sendMail(email,function(err,data){
                callback(err,data);
            });
        }
        catch (err){
            callback(err);
        }
    };

    module.exports.sendSecret = function (link, mail, callback) {
        try{
            var email = {
                from : "Civilisation 2k18",
                to : mail,
                subject : "Password reset link",
                text : "Use this link to reset your password..."+link
            };

            transport.sendMail(email,function (err, data) {
                callback(err,data);
            });

        }
        catch(err){
            callback(err);
        }
    }

})();