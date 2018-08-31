(function () {

    var express = require('express');
    var app = express();
    var cors = require('cors');
    var logger = require('morgan');
    var bodyParser = require('body-parser');
    var config = require('./server/configs/config.json');
    var connection = require('./server/configs/dbConfig');
    var mailer = require('./server/configs/mailConfig');
    var port = config.port;
    var moment = require('moment');
    var dbHandler = require('./server/middlewares/dbHandler');

    //------------------------------middlewares-----------------------------------------------//

    app.use(cors());
    app.use(logger('dev'));
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
    app.use(dbHandler(connection));

    var routes = require('./server/index')(app);


    app.listen(port);
    process.on('SIGINT',function () {
        connection.end(function(){
            console.log('App ended and DB connection Closed');
            mailer.close();
            process.exit(0);
        });
    });
    console.log("Server running on port "+port);
    module.exports = app;
})();