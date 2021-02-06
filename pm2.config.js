module.exports = {
  apps: [
    {
      script: 'app.js',
      name: 'sso-demo',
      instances: 1,
      env: {
        NODE_ENV: 'production'
      },
      env_development: {
        NODE_ENV: 'development'
      }
    }
  ]
};
