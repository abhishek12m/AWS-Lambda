module.exports.add = async (event) => {
    try {
        const { num1, num2 } = JSON.parse(event.body);
        const result = num1 + num2;
        
        return {
            statusCode: 200,
            body: JSON.stringify({ result: result })
        };
    } catch (error) {
        console.error('Error in add function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" })
        };
    }
};
