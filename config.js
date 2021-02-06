const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  NODE_ENV,
  appSso: {
    host: NODE_ENV === 'production'
      ? 'https://app-login.sso-demo.icodekk.com'
      : 'http://localhost:3000',
    port: 3000
  },
  app001: {
    host: NODE_ENV === 'production'
      ? 'https://app-001.sso-demo.icode.link'
      : 'http://localhost:3001',
    port: 3001
  },
  app002: {
    host: NODE_ENV === 'production'
      ? 'https://app-002.sso-demo.icode.link'
      : 'http://localhost:3002',
    port: 3002
  },
  redis: {
    host: '127.0.0.1',
    port: '6379'
  }

};


