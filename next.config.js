/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Replace deprecated domains configuration with remotePatterns
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // This is a placeholder - you should restrict to specific domains
      },
      // Add specific patterns for known image sources, for example:
      // {
      //   protocol: 'https',
      //   hostname: 'i.imgur.com',
      // },
      // {
      //   protocol: 'https', 
      //   hostname: 'cloudflare-ipfs.com',
      // }
    ],
  },
  
  // Add webpack configuration to handle the missing pino-pretty dependency
  webpack: (config, { isServer }) => {
    // Provide an empty module for pino-pretty
    config.resolve.alias['pino-pretty'] = false;
    
    return config;
  },
}

module.exports = nextConfig
