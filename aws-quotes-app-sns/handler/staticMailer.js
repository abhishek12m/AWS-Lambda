const AWS = require("aws-sdk");
const sns = new AWS.SNS();
const axios = require("axios");


const publisToSNS = (message) =>
    sns.publish({
        Message: message,
        TopicArn: process.env.SNS_TOPIC_ARN,
    }).promise();

const buildEmailBody = (id, form) => {
    return `Message ${form.message}
                Name: ${form.name}
                Email: ${form.email}
                Service information: ${id.sourceIp} - ${id.userAgent}
        `;
};

module.exports.staticMailer = async (event) => {
    console.log("Events::", event);
const data=JSON.parse(event.body);
    const emailBody = buildEmailBody(event.requestContext.identity, data);

    await publisToSNS(emailBody);
    await axios.post("https://4noakmy0r7.execute-api.us-east-1.amazonaws.com/dev/subscribe", { email: data.email }).
        then(function (response) {
            console.log(response);
        }).catch(function (error) {
            console.error("Error subscribing user: ", error);
        })

    return {
        statusCode: 200,
        headers: {
            "Access-Control-ALLOW-Origin": "*",
            "Access-Control-ALLOW-Credentials": false
        },
        body: JSON.stringify({ message: "OK" })
    }
}