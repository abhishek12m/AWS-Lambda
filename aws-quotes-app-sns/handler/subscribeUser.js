const AWS = require('aws-sdk');
const USERS_TABLE = process.env.USERS_TABLE;
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');



module.exports.subscribeUser = (event, context, callback) => {
    const data = JSON.parse(event.body)
    console.log("EVENTS::", data);

    const timeStamp = new Date().getTime();

    if (typeof data.email !== 'string') {
        console.error("validation error");
        return;
    }

    const params = {
        TableName: USERS_TABLE,
        Item: {
            userId: uuid.v4(),
            email: data.email,
            subscriber: true,
            createdAt: timeStamp,
            updatedAt: timeStamp
        },
    };

    dynamoDB.put(params, (error, data) => {
        if (error) {
            console.error(error);
            callback(new Error(error))
            return;
        }

        //response

        const response = {
            statusCode: 200,
            body: JSON.stringify(data.Item)
        }
        callback(null, response);
    })
}