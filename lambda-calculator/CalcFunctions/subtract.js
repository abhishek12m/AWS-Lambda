module.exports.subtract = async (event, context, callback) => {
    try {
        const { num1, num2 } = event;
        const result = num1 - num2;
        
        const response = {
            statusCode: 200,
            body: JSON.stringify({ result: result })
        };
        
        callback(null, response);
    } catch (error) {
        console.error('Error parsing request body:', error);
        callback(null, {
            statusCode: 400,
            body: JSON.stringify({ message: "Invalid request body" })
        });
    }
};