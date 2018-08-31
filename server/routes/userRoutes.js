(function () {

    var express = require('express');
    var router = express.Router();
    var userController = require('../controllers/userController');

    router.post('/donor/register',function (req, res) {
        userController.registerDonor(req,res);
    });

    router.post('/donor/verify',function (req, res) {
        userController.verifyDonor(req,res);
    });

    router.post('/donor/resendtoken',function (req, res) {
        userController.resendDonorToken(req,res);
    });

    router.post('/donor/request',function (req, res) {
        userController.raiseBloodRequest(req,res);
    });

    router.post('/donor/expand',function (req, res) {
        userController.expandRadius(req,res);
    });

    router.post('/food/center/add',function (req, res) {
        userController.addFoodRequest(req,res);
    });

    router.post('/login',function (req, res) {
        userController.login(req,res);
    });

    router.get('/get/request',function (req, res) {
        userController.getRequests(req,res);
    });

    router.get('/get/food',function (req, res) {
        userController.getFood(req,res);
    });


    module.exports = router;

})();