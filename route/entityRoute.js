const dynamoDb = require('../dynamoDb');
const uuid = require('uuid');
const app = require('express').Router();
require('dotenv').config();

const TABLENAME = process.env.TABLENAME;


//get all the data
app.get('/',async (req,res)=>{
    const params = {
        TableName: `${TABLENAME}`
    };
    try{
        let data = await dynamoDb.scan(params).promise();
        res.send(data.Items);
    }catch(error){
        console.log(error);
    }
});

//get by entity.
app.get('/:entity',async (req,res)=>{
    const entity = req.params.entity.toUpperCase();
    const params = {
        TableName: `${TABLENAME}`,
        IndexName: 'main-index',
        KeyConditionExpression: "#SK = :SK and begins_with(#PK , :PK)",
        ExpressionAttributeNames: {
            "#PK": "PK",
            "#SK" : "SK"
        },
        ExpressionAttributeValues:{
            ":PK": `${entity}`,
            ":SK": `${entity}`
        }
    };
    try {
        const data = await dynamoDb.query(params).promise();
        res.send(data.Items);
    } catch (error) {
        console.log(error)
    }
});



module.exports = app;







//reference for using GSI
// TableName: process.env.TABLENAME,
// IndexName: "user-follow-index",
// Limit: limit,
// KeyConditionExpression: "#SK = :SK and begins_with(#PK, :PK)",
// ExpressionAttributeNames: {
//   "#PK": "PK",
//   "#SK": "SK",
// },
// ExpressionAttributeValues: {
//   ":PK": `FOLLOW#${userId}`,
//   ":SK": "FOLLOWER",
// },