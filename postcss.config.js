const path = require('path')

module.exports = {
  plugins: [
    require('postcss-assets'),
    require("postcss-import")({
      root: __dirname
    }),
    require('postcss-mixins'),
    require('postcss-each'),
    require('postcss-cssnext'),
    require('postcss-reporter')({
      clearMessages: true
    })
  ]
}