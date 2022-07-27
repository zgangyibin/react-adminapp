const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    createProxyMiddleware("/dapi", {
      target: "https://8i98.com",
      secure: false,
      changeOrigin: true,
      pathRewrite: {
        "^/dapi": "/dapi",
      },
    })
  );
};
