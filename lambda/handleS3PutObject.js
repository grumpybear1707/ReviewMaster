var AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
    //Log function call
    console.log("handleS3PutObject called");
    // get reference to S3 client 
    var s3 = new AWS.S3();
    
    var srcBucket = event.Records[0].s3.bucket.name;
    console.log("S3 bucket name: " + srcBucket);
    
    var srcKey = event.Records[0].s3.object.key;
    console.log("Object key: " + srcKey);
    
    var tokens = srcKey.split("/");
    console.log("tokens: " + tokens);
    
    var filename = tokens[1];
    console.log("filename: " + filename);
    
    var username = tokens[0];
    console.log("username: " + username);
    
    var docClient = new AWS.DynamoDB.DocumentClient();
    var table = "reviewmaster";
    var datetime = new Date().getTime().toString();
    
    var params = {
    TableName:table,
    Item:{
        "username": username,
        "filename": filename,
        "timestamp": datetime
        }
    };
    console.log("ItemEntry to be made : " + params);
    
    docClient.put(params, function(err, data) {
        if (err) 
        {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            callback(err);
        } 
        else 
        {
            console.log("Added item:", JSON.stringify(data, null, 2));
            callback(null, JSON.stringify(data, null, 2));
        }
    });
};