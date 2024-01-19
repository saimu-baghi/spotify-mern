import { connectMongoDB } from "@/lib/mongodb";
import Song from "@/models/Song";

import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { S3Client } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req) {
  const { title, email, imageType, songType, author } = await req.json();
  try {
    const songName=`song-${title}-${uuidv4()}`
    const imageName=`sng-img-${title}-${uuidv4()}`
    const client = new S3Client({ region: process.env.AWS_REGION })
    const { url: img_url, fields: img_fields } = await createPresignedPost(client, {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName,
      Conditions: [
        ['content-length-range', 0, 10485760], // up to 10 MB
        ['starts-with', '$Content-Type', imageType],
      ],
      Fields: {
        acl: 'public-read',
        'Content-Type': imageType,
      },
      Expires: 3600, // Seconds before the presigned post expires. 3600 by default.
    })
    const { url: sng_url, fields: sng_fields } = await createPresignedPost(client, {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: songName,
      Conditions: [
        ['content-length-range', 0, 10485760], // up to 10 MB
        ['starts-with', '$Content-Type', songType],
      ],
      Fields: {
        acl: 'public-read',
        'Content-Type': songType,
      },
      Expires: 600, // Seconds before the presigned post expires. 3600 by default.
    })
    const song_path = `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_BUCKET_NAME}/${songName}`;
    const image_path = `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_BUCKET_NAME}/${imageName}`;
    await connectMongoDB();
    // const user = await User.findOne({ email }).select("_id");
    // const user_id= user._id;
    await Song.create({ title, image_path, user_email: email, song_path, author });

    return Response.json({
      image: { url: img_url, fields: img_fields },
      song: { url: sng_url, fields: sng_fields }
    });
  } catch (error) {
    return Response.json({ error: error.message })
  }
}
