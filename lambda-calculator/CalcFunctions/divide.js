module.exports.divide = async (event, context, callback) => {
    const { num1, num2 } = event;
    if (num2 === 0) {
        const response = {
            statusCode: 400,
            body: JSON.stringify({ error: "Division by zero is not allowed try again with other" })
        };
        callback(null, response);
    } else {
        const result = num1 / num2;
        
        const response = {
            statusCode: 200,
            body: JSON.stringify({ result: result })
        };
        
        callback(null, response);
    }
};