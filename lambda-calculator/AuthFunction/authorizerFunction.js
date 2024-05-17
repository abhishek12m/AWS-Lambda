const jwt = require('jsonwebtoken');
const { getSSMParameter } = require('../ssmUtil/ssmUtil');

module.exports.authorizeToken = async (event, context, callback) => {
    const secretKey = await getSSMParameter('SECRET_KEY');
    const token = event.headers.Authorization;

    if (!token) {
        console.log("token not provided");
        return generateErrorResponse(401, "Unauthorized: Token missing", callback);
    }

    const tokenValue = token.split(' ')[1];
    if (!tokenValue) {
        return generateErrorResponse(401, "Unauthorized: Token value missing", callback);
    }

    try {
        const decoded = jwt.verify(tokenValue, secretKey);
        return generatePolicy(decoded.username, 'Allow', event.methodArn);
    } catch (error) {
        console.log("error: ", error);
        if (error.name === 'TokenExpiredError') {
            console.log("error name: ", error.name);
            return generateErrorResponse(401, "Unauthorized: Token expired", callback);
        } else {
            return generateErrorResponse(401, "Unauthorized: Invalid token", callback);
        }
    }
};

function generatePolicy(principalId, effect, resource) {
    return {
        principalId: principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource.replace(/\/\w+$/, '/*')
                }
            ]
        }
    };
}

function generateErrorResponse(statusCode, message, callback) {
    console.log("status code: ", statusCode);
    console.log("message: ", message);
    callback("Unauthorized")
    // return {
    //     statusCode: statusCode,
    //     body: message
    // };
}
