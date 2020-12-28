const json = require('rollup-plugin-json');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const inputOptions = {
    input: '',
	plugins: [ 
		json(), 
		resolve({ 
			extensions: [ '.vue' ] 
		}),
		commonjs(),
		babel({ exclude: 'node_modules/**' }),
		
    ]
};

const outputOptions = {
    file: '',
    format: 'esm', //  需要支持 umd, esm iife, 打三个包
    name: 'HANZO',
    sourcemap:true,
    exports: 'named'
};

module.exports = {
    inputOptions,
    outputOptions
}