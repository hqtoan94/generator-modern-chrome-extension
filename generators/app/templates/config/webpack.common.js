const path = require('path');

module.exports = {
  entry: {
    backgroundServiceWorker:
      './src/entries/backgroundServiceWorker.<% if (typescript) { %>ts<% } else { %>js<% } %>',
    contentscript:
      './src/entries/contentscript.<% if (typescript) { %>ts<% } else { %>js<% } %>'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../app/scripts')
  },
  module: {
    rules: [
      <% if (typescript) { %>{
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }<% } else { %>{
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]]
          }
        }
      }<% } %>
    ]
  }
};
