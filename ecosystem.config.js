module.exports = {
  apps: [
    {
      name: 'Blogggly',
      script: './server',
      watch: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
