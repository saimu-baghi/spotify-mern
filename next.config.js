/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");
    return config;
  },
  images: {
    domains: ["picsum.photos", "s3.ap-south-1.amazonaws.com"],
  },
};

module.exports = nextConfig;
