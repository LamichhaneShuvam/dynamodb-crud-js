const dynamoDb = require('../dynamoDb');
const uuid = require('uuid');
require('dotenv').config();
const app = require('express').Router();

const TABLENAME = process.env.TABLENAME;


// //put new product
// app.post('/',async (req, res)=>{
//     const id = uuid.v4();
//     const params = {
//         TableName : `${TABLENAME}`,
//         Item: {
//             'PK' : `PRODUCT#${id}`,
//             'SK' : `PRODUCT`,
//             'name' : `${req.body.name}`,
//             'description' : `${req.body.description}`,
//             'price' : `${req.body.price}`,
//             'color' : `${req.body.color}`,
//             'id' : `${id}`
//         }
//     };
//     try{
//         const data = await dynamoDb.put(params).promise();
//         if(data)
//             res.send("Product created successfully");    
//     }catch (error) {
//         console.log(error);
//     }
// });

//put new product by update expression
app.post('/', async(req,res) => {
    const id = uuid.v4();
    const params = {
        TableName: TABLENAME,
        Key:{
            PK: `PRODUCT#${id}`,
            SK: `PRODUCT`
        },
        UpdateExpression: "set #color = :color, #price = :price, #name = :name, #description = :description, #id = :id, #invocation = invocation + 1",
        ExpressionAttributeNames:{
            "#color": "color",
            "#price": "price",
            "#name":"name",
            "#description": "description",
            "#id": "id",
            "#invocation" : "invocation"
        },
        ExpressionAttributeValues:{
            ':color' : `${req.body.color}`,
            ':price' : `${req.body.price}`,
            ':name' : `${req.body.name}`,
            ':description' : `${req.body.description}`,
            ':id' : `${id}`
        },
        ReturnValues : 'UPDATED_NEW'
    };
    try {
        const data = await dynamoDb.update(params).promise();
        res.send(data.Attributes);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

//get by product id
app.get('/:id', async(req,res)=>{
    const params = {
        TableName: `${TABLENAME}`,
        Key: {
            PK: `PRODUCT#${req.params.id}`,
            SK: `PRODUCT`
        }
    };
    try{
        const  data = await dynamoDb.get(params).promise();
        res.send(data.Item);    
    } catch (error){
        console.log(error);
    }
});

//delete ProductById
app.delete('/:id',async(req,res)=>{
    const params = {
        TableName: `${TABLENAME}`,
        Key:{
            PK: `PRODUCT#${req.params.id}`,
            SK: `PRODUCT`
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

//update product //color, price, name, description
app.put('/:id',async(req, res)=>{
    const params = {
        TableName: TABLENAME,
        Key:{
            PK: `PRODUCT#${req.params.id}`,
            SK: `PRODUCT`
        },
        UpdateExpression: "set color = :color, price = :price, #name = :name, description = :description, invocation = invocation + :p",
        ExpressionAttributeNames:{"#name":"name"},
        ExpressionAttributeValues:{
            ':color' : `${req.body.color}`,
            ':price' : `${req.body.price}`,
            ':name' : `${req.body.name}`,
            ':description' : `${req.body.description}`,
            ':p' : 1
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