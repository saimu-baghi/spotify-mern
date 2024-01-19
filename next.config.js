/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
       domains: [
         'picsum.photos',
         's3.ap-south-1.amazonaws.com'
      ],
    },
   }
   
   module.exports = nextConfig