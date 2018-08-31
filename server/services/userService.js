(function () {

    var userDao = require('../dao/userDao');


    module.exports.registerDonor = function (donor, callback) {
        userDao.registerDonor(donor,callback);
    };

    module.exports.mapDonorToken = function (map, callback) {
        userDao.mapDonorToken(map,callback);
    };

    module.exports.verifyDonor = function (body, callback) {
        userDao.verifyDonor(body,callback);
    };

    module.exports.updateFlag = function (email, callback) {
        userDao.updateFlag(email,callback);
    };

    module.exports.fetchToken = function (email, callback) {
        userDao.fetchToken(email,callback);
    };

    module.exports.login = function (email, password, callback) {
        userDao.login(email,password,callback);
    };

    module.exports.getRequests = function (callback) {
        userDao.getRequests(callback);
    }

})();