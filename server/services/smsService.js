(function () {

    var nexmo = require('../configs/smsConfig');

    var from = "Sevagan";
    
    module.exports.sendSms = function (phone,contact, callback) {
        try{
            var text = "There is an urgent need for blood in your area. Contact "+contact+" for further details";
            nexmo.message.sendSms(from,phone,text,function (err, data) {
                callback(err,data);
            })
        }
        catch(err){
            callback(err);
        }
    };

})();