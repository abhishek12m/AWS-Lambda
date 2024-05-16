const jwt = require('jsonwebtoken');

module.exports.authorizeToken = async (event) => {
    try {
        const token = event.headers.Authorization;

        if (!token) {
            return generateErrorResponse(401, "Unauthorized: Token missing");
        }

        const tokenValue = token.split(' ')[1];
        if (!tokenValue) {
            return generateErrorResponse(401, "Unauthorized: Token value missing");
        }

        try {
            const secretKey = 'not_secret';
            const decoded = jwt.verify(tokenValue, secretKey);
            return generatePolicy(decoded.username, 'Allow', event.methodArn);
        } catch (error) {
            console.log("error: ", error);
            if (error.name === 'TokenExpiredError') {
                console.log("error name: ", error.name);
                return generateErrorResponse(401, "Unauthorized: Token expired");
            } else {
                return generateErrorResponse(401, "Unauthorized: Invalid token");
            }
        }
    } catch (error) {
        console.error('Error authorizing token:', error);
        return generateErrorResponse(500, "Internal Server Error");
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
