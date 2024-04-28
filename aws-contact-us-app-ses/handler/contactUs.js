const AWS=require("aws-sdk");
const ses=new AWS.SES();



module.exports.contactUs=async(event,context)=>{
    console.log("Events::",event);

    const {to,from,subject,message}=JSON.parse(event.body);

    if(!to || !from || !subject || !message){
        return {
            headers:{
                "Content-Type":"application/json",
                "Access-Control-Allow-Methods":"*",
                "Access-Control-Allow-Origin":"*",
            },
            statusCode:400,
            body:JSON.stringify({message:"to or form not set properly...."}),
        };
    }
    const params={
        Destination:{
            ToAddresses:[to],
        },
        Message:{
            Body:{
                Text:{Data:message}
            },
            Subject:{
                Data:subject
            },
        },
        Source:from
    };

    try{
        await ses.sendEmail(params).promise();
        return {
            headers:{
                "Content-Type":"application/json",
                "Access-Control-Allow-Methods":"*",
                "Access-Control-Allow-Origin":"*",
            },
            statusCode:200,
            body:JSON.stringify({message:"Email sent successfully..",success:true}),
        };
    }
    catch(error){
        console.error();
        return {
            headers:{
                "Content-Type":"application/json",
                "Access-Control-Allow-Methods":"*",
                "Access-Control-Allow-Origin":"*",
            },
            statusCode:400,
            body:JSON.stringify({message:"The Email failed to send..",success:false})
        };
    }

};