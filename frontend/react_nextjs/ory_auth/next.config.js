module.exports = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:4455/:path*', // Proxy to Kratos backend
        },
      ]
    },
  }

