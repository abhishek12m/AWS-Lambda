module.exports.add = async (event, context, callback) => {
    const { num1, num2 } = event;
    const result = num1 + num2;
    
    const response = {
        statusCode: 200,
        body: JSON.stringify({ result: result })
    };
    
    callback(null, response);
};