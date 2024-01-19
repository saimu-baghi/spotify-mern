import { connectMongoDB } from "@/lib/mongodb";
import playlists from "@/models/Playlists";

import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { S3Client } from '@aws-sdk/client-s3'

export async function POST(req) {
  const { title, email, contentType } = await req.json();
  try {
    const fileName=`plylst-img-${title}`
    const client = new S3Client({ region: process.env.AWS_REGION })
    const { url, fields } = await createPresignedPost(client, {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Conditions: [
        ['content-length-range', 0, 10485760], // up to 10 MB
        ['starts-with', '$Content-Type', contentType],
      ],
      Fields: {
        acl: 'public-read',
        'Content-Type': contentType,
      },
      Expires: 600, // Seconds before the presigned post expires. 3600 by default.
    })
    const image_path = `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_BUCKET_NAME}/${fileName}`;
    await connectMongoDB();
    // const user = await User.findOne({ email }).select("_id");
    // const user_id= user._id;
    await playlists.create({ title, image_path, user_email: email });

    return Response.json({ url, fields })
  } catch (error) {
    console.log("error creating playlist", error)
    return Response.json({ error: error.message })
  }
}
