const addFunction = require('../CalcFunctions/add');
const subtractFunction = require('../CalcFunctions/subtract');
const multiplyFunction = require('../CalcFunctions/multiply');
const divideFunction = require('../CalcFunctions/divide');
const { authorizeToken } = require('../AuthFunction/authorizerFunction');

module.exports.calculate = async (event) => {
    try {
        const authResult = await authorizeToken(event);
        // console.log("authresult: ",authResult);

        if (authResult.statusCode !== 200) {

            return authResult;
        }


        const operator = event.pathParameters.operator;
        // console.log("operator: ", operator);
        const functions = {
            'add': addFunction.add,
            'subtract': subtractFunction.subtract,
            'multiply': multiplyFunction.multiply,
            'divide': divideFunction.divide
        };

        const selectedFunction = functions[operator];
        // console.log("selected function", selectedFunction)
        if (!selectedFunction || typeof selectedFunction !== 'function') {
            throw new Error('Function not found');
        }

        const result = await selectedFunction(event);

        return result;
    } catch (error) {
        console.error('Error in calculate function:', error);
        return error;
    }
};
