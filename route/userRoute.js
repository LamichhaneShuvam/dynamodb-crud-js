const dynamoDb = require('../dynamoDb');
const {v4: uuid } = require('uuid');
const app = require('express').Router();
require('dotenv').config();

const TABLENAME = process.env.TABLENAME;

//get user by id
app.get('/:id', async(req,res)=>{
    const params = {
        TableName: `${TABLENAME}`,
        Key: {
            PK: `USER#${req.params.id}`,
            SK: `USER`
        }
    };
    try{
        const  data = await dynamoDb.get(params).promise();
        res.send(data.Item);    
    } catch (error){
        console.log(error);
    }
});


// //put the user
// app.post('/',async (req, res)=>{
//     const id = uuid.v4();
//     const params = {
//         TableName : `${TABLENAME}`,
//         Item: {
//             'PK' : `USER#${id}`,
//             'SK' : `USER`,
//             'name' : `${req.body.name}`,
//             'email' : `${req.body.email}`,
//             'phone' : `${req.body.phone}`,
//             'id' : `${id}`
//         },
//         //ReturnValues: '' // any _NEW doesn't work...
//     };
//     try{
//         const data = await dynamoDb.put(params).promise();
//         if(data)
//             res.send("user created successfully");    
//     }catch (error) {
//         console.log(error);
//         res.send(error);
//     }
// });

//same put user but update insted of put
app.post('/',async(req,res)=>{
    const id = uuid();
    const params = {
        TableName: `${TABLENAME}`,
        Key:{
            PK: `USER#${id}`,
            SK: `USER`
        },
        UpdateExpression:"set #name = :name, #phone = :phone, #email = :email, #id = :id",
        ExpressionAttributeNames: {
            "#name" : "name",
            "#phone":"phone",
            "#email":"email",
            "#id": "id"
        },
        ExpressionAttributeValues: {
            ':name' : `${req.body.name}`,
            ':phone' : `${req.body.phone}`,
            ':email' : `${req.body.email}`,
            ':id' : `${id}`
        }, ReturnValues: "UPDATED_NEW"
    };
    try {
        const data = await dynamoDb.update(params).promise();
        res.send(data.Attributes);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

//delete user
app.delete('/:id',async(req,res)=>{
    const params = {
        TableName: `${TABLENAME}`,
        Key:{
            PK: `USER#${req.params.id}`,
            SK: `USER`
        },
        ReturnValues: 'ALL_OLD'
    };
    try {
        const data = await dynamoDb.delete(params).promise();
        res.send(data);    
    } catch (error) {
        console.log(error);
    }
});

//update user
app.put('/:id',async(req, res)=>{
    const params = {
        TableName: TABLENAME,
        Key:{
            PK: `USER#${req.params.id}`,
            SK: `USER`
        },
        UpdateExpression: "set #name = :name, phone = :phone, email = :email",
        ExpressionAttributeNames:{"#name":"name"},
        ExpressionAttributeValues:{
            ':name' : `${req.body.name}`,
            ':phone' : `${req.body.phone}`,
            ':email' : `${req.body.email}`
        },
        ReturnValues : 'UPDATED_NEW'
    };
    try {
        const data = await dynamoDb.update(params).promise();
        res.send(data.Attributes);
    } catch (error) {
        res.send(error);
    }
});



module.exports = app;