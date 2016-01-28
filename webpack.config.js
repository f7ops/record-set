module.exports = {
  entry: "./index.js",
  output: {
    path: __dirname,
    filename: "bundle.js",
    libraryTarget: "umd"
  },
  resolve: {
    extensions: ["", ".js"]
  },
  node: {
    fs: "empty"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        presets: ['es2015']
      }
    ]
  }
}
