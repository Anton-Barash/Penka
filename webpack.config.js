
const path = require('path');

module.exports = {
  mode: 'development',
  entry: "./src/index.js",
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  
  output: {
    path: path.resolve(__dirname, './build/js/'),
    filename: 'bundle.js'
  }
};