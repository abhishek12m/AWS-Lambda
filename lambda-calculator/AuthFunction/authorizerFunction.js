const jwt = require('jsonwebtoken');

module.exports.authorizeToken = async (event) => {
    try {
        const token = event.headers.authorization;
        // console.log('Headers:', event.headers);
        // console.log('Token:', token);
        if (!token) {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: "Unauthorized: Token missing" })
            };
        }
        const secretKey = 'not_secret';

        const decoded = await jwt.verify(token.split(" ")[1], secretKey);

        // console.log('Decoded token:', decoded);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Token is valid" })
        };
    } catch (error) {
        console.error('Error authorizing token:', error);
        return {
            statusCode: 401,
            body: JSON.stringify({ error: "Unauthorized: Invalid token" })
        };
    }
};
