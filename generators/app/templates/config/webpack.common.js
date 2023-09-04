const path = require('path');
<% if (contentScript) { %>
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
<% } %>

module.exports = {
  entry: {
    'scripts/backgroundScripts':
      './src/entries/backgroundServiceWorker.<% if (typescript) { %>ts<% } else { %>js<% } %>'<% if (contentScript) { %>,
    'scripts/contentscript': './src/entries/contentscript.<% if (typescript) { %>ts<% } else { %>js<% } %>',
    'styles/contentscript': './src/styles/contentscript.scss'<% } %>
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../app')
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
      }<% } %><% if (contentScript) { %>, {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      }<% } %>
    ]
  }<% if (contentScript) { %>,
  plugins: [new MiniCssExtractPlugin()]<% } %>
};
