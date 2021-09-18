/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    apiBaseUrl:
      process.env.NODE_ENV === 'production' ? 'http://cats.daviddiaz.es:8080/graphql' : 'http://localhost:8080/graphql',
  },
};
