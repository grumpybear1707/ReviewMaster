'use strict';

console.log('Loading function s3GetFolderContent');

const aws = require('aws-sdk');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });


exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    var params =
    {
      Bucket: 'wildan.reviewmaster.reviewdata',
      Prefix: event.folderName
    }
    s3.listObjectsV2(params, function(err, data)
    {
      if (err)
      {
        console.log(err, err.stack); // an error occurred
        callback(err);
      }
      else
      {
        console.log(data);           // successful response
        var reviewItems=[];
        data.Contents.forEach(function(item)
        {
          if(item.Key.charAt(item.Key.length -1) !== '/')
            reviewItems.push({"ItemName":item.Key});
        });
        console.log("Sending back contents: " + reviewItems);
        callback(null,reviewItems);
      }
    });
};
