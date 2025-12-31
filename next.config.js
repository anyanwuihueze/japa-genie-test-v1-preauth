const withPWA = require('next-pwa')({
  dest: 'public',
  disable: false,  // ← ENABLE PWA
  register: true,
  skipWaiting: false,  // ← THE FIX
  scope: '/',
  publicExcludes: ['!robots.txt', '!sitemap.xml'],
  buildExcludes: [/middleware-manifest\.json$/],
  runtimeCaching: [
    {
      urlPattern: /\/_next\/.*/,
      handler: 'NetworkOnly'
    }
  ]
})

module.exports = withPWA({
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['*'],
    },
  },
})
