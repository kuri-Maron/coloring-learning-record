module.exports = {
  pages: {
    index: {
      entry: "src/main.js",
      title: "カラー学習記録",
    },
  },
  transpileDependencies: ["vuetify"],
  configureWebpack: {
    devtool: "source-map",
  },
};
