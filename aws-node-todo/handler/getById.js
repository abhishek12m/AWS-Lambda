const AWS = require("aws-sdk");
const TODO_TABLE = process.env.TODO_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.getById = (event, context, callback) => {


    const params = {
        TableName: TODO_TABLE,
        Key: {
            id: event.pathParameters.id
        }
    }

    dynamoDb.get(params, (error, data) => {
        if (error) {
            console.error(error);
            callback(new Error(error));
            return;
        }

        // response
        const response = data.Item
            ?
            {
                statusCode: 200,
                body: JSON.stringify(data.Item),
            }
            : {
                statusCode: 404,
                body: JSON.stringify({ message: "not found" }),

            }
        callback(null, response);
    })
}