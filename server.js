//server.js
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var config = require('./config/config.json');
var router = require('./routes/route');
const mysql = require('mysql');
 var path = require('path');

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }));
app.use(bodyParser.json({ limit: '50mb' }));
//app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.raw());

app.use(function (req, res, next) {//allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization, Cache-Control,authorizationcode");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.use('/' + config.tmpImageUploadPath, express.static(__dirname + '/' + config.tmpImageUploadPath));
app.use('/' + config.publicPath, express.static(__dirname + '/' + config.publicPath));
app.use('/' + config.LogPath, express.static(__dirname + '/' + config.LogPath));
app.use('/v1/', require('./routes/route'));

app.use(function (err, req, res, next) {
    res.status(400).json(err);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//require('events').EventEmitter.prototype._maxListeners = 100; 



connectMongo();
 
function listen() {
    app.listen(config.PORT, function () {
        console.log('Server is running on Port', config.PORT);
    }).on('error', function () {
        console.log('Server is not running on Port', config.PORT);
    });
}

function connectMongo() {
    mongoose.connection
        .on('error', function (err) {
            console.log('Mongo connection error', console.log);
        }).on('disconnected', connectMongo).once('open', listen);

if(mongoose.connection.readyState != 1) {
        mongoose.connect(config.mongo.connectionString, config.options);        
    }
   // return mongoose.connect(config.mongo.connectionString, config.options);
}

 

/*
let interval;
var io = require('socket.io')(serverjsp, { origins: '*:*'});
io.of('/v1/order/order-list').on('connection', function(socket)
{
    socket.on('orderList', function(getdataSocket)
    {
		 socket.join(getdataSocket.appId);
		var orderCntrl = require('./controller/order-create.controller');
		if (interval) {
			clearInterval(interval);
        }
        //orderCntrl.orderList(getdataSocket,socket);
		interval = setInterval(() => orderCntrl.orderList(getdataSocket,socket), 5000);

    });

});
//app.set('io', io);
*/
