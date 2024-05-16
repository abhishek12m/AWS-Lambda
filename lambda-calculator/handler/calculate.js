const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

exports.calculate = async (event, context, callback) => {
    
    if (!event.body) {
        const response = {
            statusCode: 400,
            body: JSON.stringify({ error: "No request body provided" })
        };
        return callback(null, response);
    }

    
    const requestBody = JSON.parse(event.body);
    const { num1, num2 } = requestBody;
    const operator=event.pathParameters.operator;

    
    if (!operator || !num1 || !num2) {
        const response = {
            statusCode: 400,
            body: JSON.stringify({ error: "Invalid request body" })
        };
        return callback(null, response);
    }

    
    const functions = {
        'add': 'lambda-calculator-dev-add',
        'subtract': 'lambda-calculator-dev-subtract',
        'multiply': 'lambda-calculator-dev-multiply',
        'divide': 'lambda-calculator-dev-divide'
    };

    
    if (!functions.hasOwnProperty(operator)) {
        const response = {
            statusCode: 400,
            body: JSON.stringify({ error: "Invalid operator" })
        };
        return callback(null, response);
    }

    
    const params = {
        FunctionName: functions[operator],
        Payload: JSON.stringify({ num1, num2 })
    };

    try {
        const result = await lambda.invoke(params).promise();
        console.log("result: ",result);
        callback(null, {
            statusCode: 200,
            body: result.Payload
        });
    } catch (error) {
        callback(error);
    }
};