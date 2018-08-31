(function () {

    var commonService = require('../services/commonService');
    var responseHandler = require('../helpers/responseHandler');
    var transactionHandler = require('../helpers/transactionHandler');


    module.exports.getBloodGroups = function (req, res) {
        try{
            commonService.getBloodGroups(function (err, data) {
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