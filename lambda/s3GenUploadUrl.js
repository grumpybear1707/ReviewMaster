'use strict';

console.log('Loading function');

const aws = require('aws-sdk');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });


exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    //Generate a random S3 key name
    var upload_key = event.folderName + "/" + event.itemName;

    s3.getSignedUrl('putObject', 
    {
        Bucket: 'wildan.reviewmaster.reviewdata',
        Expires: 60*15,
        Key: upload_key,
        ContentType: 'application/zip'
    }, function (err, presigned_url) 
    {
        if(err)
        {
            console.log("Generate presigned url failed- err: " + err);
            callback(err);
        }
        else
        {
            console.log(presigned_url);
            const response = 
            {
                statusCode: 200,
                headers: 
                {
                "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
                "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
                },
                body: { "presigned_url": presigned_url }
            };
            callback(null, response);
        }
        
    });
};