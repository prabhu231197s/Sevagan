(function(){

    module.exports = function (app) {
        app.use('/api/web',require('./routes/commonRoutes'));
        app.use('/user',require('./routes/userRoutes'));
    };

})();