/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_APP_NAME: '{{PROJECT_NAME}}',
  },
}

module.exports = nextConfig