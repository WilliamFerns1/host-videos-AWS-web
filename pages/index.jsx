import { useEffect, useState } from 'react';
import AWS from 'aws-sdk';

const VideoPage = ({ videos }) => {
  return (
    <div>
      <h1>Video Library</h1>
      <div>
        {videos.map((video, index) => (
          <div key={index}>
            <h2>{video.name}</h2>
            <video width="640" height="360" controls>
              <source src={video.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>
    </div>
  );
};

export async function getStaticProps() {
  // Configure AWS SDK
  AWS.config.update({
    accessKeyId: 'YOUR_ACCESS_KEY',
    secretAccessKey: 'YOUR_SECRET_KEY',
    region: 'YOUR_REGION',
  });

  const s3 = new AWS.S3();

  // Replace 'YOUR_BUCKET_NAME' with your actual S3 bucket name
  const bucketName = 'YOUR_BUCKET_NAME';

  // List objects in the bucket
  const params = { Bucket: bucketName };
  const data = await s3.listObjects(params).promise();

  // Construct video URLs
  const videos = data.Contents.map((item) => ({
    name: item.Key,
    url: `https://${bucketName}.s3.amazonaws.com/${item.Key}`,
  }));

  return {
    props: {
      videos,
    },
  };
}

export default VideoPage;

