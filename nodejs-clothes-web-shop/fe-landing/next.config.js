/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                hostname: process.env.BASE_BACKEND_URL
            }
        ]
    }
};

module.exports = nextConfig;
