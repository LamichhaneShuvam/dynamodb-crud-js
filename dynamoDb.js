const {DynamoDB} = require('aws-sdk');
require('dotenv').config();
const dynamoDb = new DynamoDB.DocumentClient(
    { 
        endpoint: process.env.DYNAMOENDPOINT, 
        accessKeyId: process.env.ACCESSKEYID, 
        secretAccessKey: process.env.ACCESSSECRETEID, 
        region: process.env.REGION 
    }
);


module.exports = dynamoDb;




//for reference

//put the user but product entity type already exists
// app.post('/product',(req,res)=>{
//     const params = {
//         TableName : 'Product',
//         Key : {
//             PK: `${req.body.name}`,
//             //SK: `${req.body.name}#${uuid.v4()}`
//         },
//         UpdateExpression: 'set PK = :PK, SK = :SK',
//         ExpressionAttributeValues : {
//             ":PK": `${req.body.name}`,
//             ":SK": `${req.body.name}#${uuid.v4()}`
//         }
//     };
//     try {
//         console
//     } catch (error) {
        
//       console.log(error)  
//     }
// });