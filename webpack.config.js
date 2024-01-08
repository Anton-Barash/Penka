const TerserPlugin = require('terser-webpack-plugin');
 
module.exports = {
  mode: 'production',
  optimization: {
    minimizer: [new TerserPlugin({
      terserOptions: {
        format: {
          comments: false,
        },
      },
      extractComments: false,
    })],
  },
}