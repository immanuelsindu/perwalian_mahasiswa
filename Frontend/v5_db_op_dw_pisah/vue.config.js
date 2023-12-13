const { defineConfig } = require("@vue/cli-service");

// module.exports = defineConfig({
//     publicPath: "/",
//     transpileDependencies: true,
// });


// const { defineConfig } = require("vue");
// const CryptoBrowserifyPlugin = require("crypto-browserify");

module.exports = defineConfig({
    publicPath: "/",
    transpileDependencies: true,
    configureWebpack: {
        resolve: {
            fallback: {
                "crypto": false,
                "os": false,
                "fs": false,
                "path": false,
                "url": false,
                "http": false,
                "zlib": false,
                "https": false
                // "crypto": require.resolve("crypto-browserify"),
                // ... opsi lain yang mungkin diperlukan resolve.fallback: {  }
            }
        },
    }
});
