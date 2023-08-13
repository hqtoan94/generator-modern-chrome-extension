const path = require('path');

module.exports = {
  entry: {
    backgroundServiceWorker: './src/entries/backgroundServiceWorker.js',
    contentScript: './src/entries/contentScript.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../app/scripts')
  },
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]]
          }
        }
      }
    ]
  }
};
