'use strict';
const path = require('path');

const configure = function (configurator, options) {
  // Add your project specific config!
  configurator.merge({
    entry: {
      reduxDiffLogger: path.resolve(__dirname, 'src', 'index.js')
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      libraryTarget: 'commonjs2'
    }
  });

  options.backendBuild = true;

  return configurator;
};


const postConfigure = function (configurator, options) {
};

module.exports = {
  configure: configure,
  postConfigure: postConfigure
};
