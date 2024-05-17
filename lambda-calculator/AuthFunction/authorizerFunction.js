const jwt = require('jsonwebtoken');
const { getSSMParameter } = require('../ssmUtil/ssmUtil');

module.exports.authorizeToken = async (event, context, callback) => {
    try {
        const secretKey = await getSSMParameter('SECRET_KEY');
        const token = event.headers.Authorization;

        if (!token) {
            console.log("Token not provided");
            return callback(null, generateErrorResponse(401, "Unauthorized: Token missing"));
        }

        const tokenValue = token.split(' ')[1];
        if (!tokenValue) {
            return callback(null, generateErrorResponse(401, "Unauthorized: Token value missing"));
        }

        try {
            const decoded = jwt.verify(tokenValue, secretKey);
            return callback(null, generatePolicy(decoded.username, 'Allow', event.methodArn));
        } catch (error) {
            console.log("Error: ", error);
            if (error.name === 'TokenExpiredError') {
                console.log("Error name: ", error.name);
                return callback(null, generateErrorResponse(401, "Unauthorized: Token expired"));
            } else {
                return callback(null, generateErrorResponse(401, "Unauthorized: Invalid token"));
            }
        }
    } catch (error) {
        console.error('Error authorizing token:', error);
        return callback(null, generateErrorResponse(500, "Internal Server Error"));
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

function generateErrorResponse(statusCode, message) {
    return {
        statusCode: statusCode,
        body: JSON.stringify({ message: message })
    };
}
