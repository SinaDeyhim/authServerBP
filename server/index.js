// main startin gpoint of the application

// this is done using older node version so import was not supported

const express = require ('express');
const http = require ('http');
const bodyParser = require ('body-parser');
const morgan = require ('morgan');
const router = require ('./router');
const mongoose = require('mongoose');

const app = express();


// DB setup

mongoose.connect('mongodb://localhost:/auth');
//mongoose.connect('mongodb://localhost:auth/auth');


// app setup: getting Express to talk to the outside world
// app.use registers middlewares
app.use(morgan('combined')); // morgan is a logging framework
app.use(bodyParser.json({ type: '*/*' })); // parse incomming requests to json
router(app);



//server setup

const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('server listening on:' , port);
