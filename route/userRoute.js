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

//Inserting value and increasing the value of counter
app.post('/', async (req,res)=>{
    const id = uuid();
    const params = {
        TransactItems:[
            {
                Update: {
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
                    }
                }
            },
            {
                Update: {
                    TableName: `${TABLENAME}`,
                    Key:{
                        PK: `STAT#USER`,
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
        if(data){
            const returnVal = {
                PK: `USER#${id}`,
                SK: `USER`,
                name : `${req.body.name}`,
                phone : `${req.body.phone}`,
                email : `${req.body.email}`,
                id : `${id}`
            }
            res.send(returnVal);
        }

    } catch (error) {
        console.log(error);
        res.send(error);

    }
});


//delete transaction where stat count is decreased
app.delete('/:id', async (req,res) => {
    const params = {
        TransactItems: [
            {
               Delete: {
                    TableName: `${TABLENAME}`,
                    Key:{
                        PK: `USER#${req.params.id}`,
                        SK: `USER`
                    }
                }
            },
            {
                Update: {
                    TableName: `${TABLENAME}`,
                    Key:{
                        PK: `STAT#USER`,
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
        res.send(error);
    }
})

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