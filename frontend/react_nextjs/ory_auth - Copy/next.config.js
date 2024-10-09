module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4433/:path*' // Proxy to your Ory Kratos server
      }
    ]
  }
};
