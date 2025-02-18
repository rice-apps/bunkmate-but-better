/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname,
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true, // to:do REMOVE THIS SHIT AS SOON AS POSSIBLE @SATHYA @GABE YES - LUCY
  },
};

module.exports = nextConfig;
