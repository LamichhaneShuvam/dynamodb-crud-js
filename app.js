const express = require('express');
const dynamoDb = require('./dynamoDb');
require('dotenv').config();


//getting all the routes
const entityRoute = require('./route/entityRoute');
const productRoute = require('./route/productRoute');
const userRoute = require('./route/userRoute');


const app = express();
const port = 3000 || process.env.PORT;
app.use(express.json());

//sending through the routes
app.use('/entity',entityRoute);
app.use('/user', userRoute);
app.use('/product', productRoute);



app.listen(port, ()=>console.log(`Server started on port -> ${port}`));