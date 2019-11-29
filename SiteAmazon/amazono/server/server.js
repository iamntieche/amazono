const express=require('express');
const morgan= require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors= require('cors');//evite les erreurs Cross-Allow-Origin
const config = require('./config');
const app=express();

//fonction permettant de communiquer avec mongoDB
mongoose.connect(config.database, {useMongoClient:true} ,(err)=>{//useMongoClient permet de supprimer le sms de depreciation asur la console
    if(err){
        console.log(err);
    }
    else{
        console.log("Connected to the database");
    }
});

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));
app.use(cors());

const userRoutes = require('./routes/account');
const mainRoutes = require('./routes/main');
const sellerRoutes = require('./routes/seller');

app.use('/api', mainRoutes);
app.use('/api/accounts', userRoutes);
app.use('/api/seller', sellerRoutes);

app.listen(config.port,(err)=>{
    console.log('magic happens on port trop fort '+config.port);
});
