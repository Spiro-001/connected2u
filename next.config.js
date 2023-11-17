/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["connected2u.s3.us-east-1.amazonaws.com"],
  },
  env: {
    MAX_FETCH_SIZE: 10, // in MB
  },
};

module.exports = nextConfig;
