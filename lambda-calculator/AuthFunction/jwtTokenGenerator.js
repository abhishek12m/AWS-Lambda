const jwt = require('jsonwebtoken');

module.exports.generateToken = async (event) => {
    try {
        const { username, password } = JSON.parse(event.body);

        const secretKey = 'not_secret';

        const token = jwt.sign({ username, password }, secretKey, { expiresIn: '1h' });

        return {
            statusCode: 200,
            body: JSON.stringify({ token: token })
        };
    } catch (error) {
        console.error('Error generating token:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" })
        };
    }
};
