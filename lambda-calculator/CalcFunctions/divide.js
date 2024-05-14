module.exports.divide = async (event) => {
    try {
        const { num1, num2 } = JSON.parse(event.body);

        if (num2 === 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Division by zero is not allowed" })
            };
        } else {
            const result = num1 / num2;
            
            return {
                statusCode: 200,
                body: JSON.stringify({ result: result })
            };
        }
    } catch (error) {
        console.error('Error in divide function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" })
        };
    }
};
