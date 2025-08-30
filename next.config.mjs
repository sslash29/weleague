/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "200MB",
    },
  },
  images: {
    remotePatterns: [
      new URL(
        "https://wulkwxswuyndpypbxhfm.supabase.co/storage/v1/object/public/player_images/**"
      ),
      new URL(
        "https://wulkwxswuyndpypbxhfm.supabase.co/storage/v1/object/public/team_crest_images/**"
      ),
      {
        protocol: "https",
        hostname: "wulkwxswuyndpypbxhfm.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
