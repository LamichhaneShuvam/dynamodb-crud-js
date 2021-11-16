const dynamoDb = require('../dynamoDb');
const uuid = require('uuid');
require('dotenv').config();
const app = require('express').Router();

const TABLENAME = process.env.TABLENAME;


//put new product and increase product stat counter
app.post('/',async(req,res)=>{
    const id = uuid.v4();
    const params = {
        TransactItems: [
            {
                Update: {
                    TableName: TABLENAME,
                    Key:{
                        PK: `PRODUCT#${id}`,
                        SK: `PRODUCT`
                    },
                    UpdateExpression: "set #color = :color, #price = :price, #name = :name, #description = :description, #id = :id",
                    ExpressionAttributeNames:{
                        "#color": "color",
                        "#price": "price",
                        "#name":"name",
                        "#description": "description",
                        "#id": "id",
                    },
                    ExpressionAttributeValues:{
                        ':color' : `${req.body.color}`,
                        ':price' : `${req.body.price}`,
                        ':name' : `${req.body.name}`,
                        ':description' : `${req.body.description}`,
                        ':id' : `${id}`
                    }
                }
            },
            {
                Update: {
                    TableName: `${TABLENAME}`,
                    Key:{
                        PK: `STAT#PRODUCT`,
                        SK: `STAT`
                    },
                    UpdateExpression:"set #count = #count + :p",
                    ExpressionAttributeNames: {
                        "#count" : "count"
                    },
                    ExpressionAttributeValues: {
                        ':p' : 1
                    }
                }
            }
        ]
    };
    try {
        const data = await dynamoDb.transactWrite(params).promise();
        res.send(data);
    } catch (error) {
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

//delete product and decrease the counter
app.delete('/:id', async (req,res)=>{
    const params = {
        TransactItems: [
            {
               Delete: {
                    TableName: `${TABLENAME}`,
                    Key:{
                        PK: `PRODUCT#${req.params.id}`,
                        SK: `PRODUCT`
                    }
                }
            },
            {
                Update: {
                    TableName: `${TABLENAME}`,
                    Key:{
                        PK: `STAT#PRODUCT`,
                        SK: `STAT`
                    },
                    UpdateExpression:"set #count = #count - :p",
                    ExpressionAttributeNames: {
                        "#count" : "count"
                    },
                    ExpressionAttributeValues: {
                        ':p' : 1
                    }
                }
            }
        ]
    };
    try {
        const data = await dynamoDb.transactWrite(params).promise();
        res.send(data);
    } catch (error) {
        console.log(error);
        res.send(error);
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
        UpdateExpression: "set color = :color, price = :price, #name = :name, description = :description",
        ExpressionAttributeNames:{"#name":"name"},
        ExpressionAttributeValues:{
            ':color' : `${req.body.color}`,
            ':price' : `${req.body.price}`,
            ':name' : `${req.body.name}`,
            ':description' : `${req.body.description}`,
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