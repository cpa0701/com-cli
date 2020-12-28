const { webpackBuild } = require('./webpack-build/index');
const { build } = require('./rollup-build/hanzo-rollup');

module.exports = {
  webpackBuild,
  rollupBuild: build
};