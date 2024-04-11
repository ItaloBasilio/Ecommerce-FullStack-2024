const express = require('express');
const dbConnect = require('./config/dbConnect');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;

dbConnect();
//Endpoint
app.use('/', (req,res)=>{
    res.send('Hello server')
})

app.listen(PORT, ()=>{
    console.log(`🚀 Server is running in port ${PORT}`);
})

