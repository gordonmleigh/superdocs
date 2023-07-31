/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/superdocs",
  output: "export",
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      extensionAlias: {
        ...config.resolve?.extensionAlias,
        ".js": [".ts", ".js"],
      },
    };
    return config;
  },
};

module.exports = nextConfig;
