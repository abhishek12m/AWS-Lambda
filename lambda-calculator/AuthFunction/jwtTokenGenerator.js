const jwt = require('jsonwebtoken');
const { getSSMParameter } = require('../ssmUtil/ssmUtil');

module.exports.generateToken = async (event) => {
    try {
        const secretKey = await getSSMParameter("SECRET_KEY");
        const { username, password, expiresIn } = JSON.parse(event.body);

        const token = jwt.sign({ username, password }, secretKey, { expiresIn: expiresIn || '1h' });

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
