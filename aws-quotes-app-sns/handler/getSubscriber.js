const AWS = require('aws-sdk');
const USERS_TABLE = process.env.USERS_TABLE;
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.getSubscriber=(event,context,callback)=>{
    const params={
        TableName:USERS_TABLE,
    };

    dynamoDB.scan(params,(error,data)=>{
        if(error){
            console.error(error);
            callback(new Error(error))
            return
        }
        const response={
            statusCode:200,
            body:JSON.stringify(data.Items),
        };
        callback(null,response);
    });
};