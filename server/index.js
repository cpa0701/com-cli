const webpack = require( 'webpack' );
const WebpackDevServer = require( 'webpack-dev-server' );
const webpackConfig = require( './webpack.config' );
const portfinder = require('portfinder');
const pcLoader = require('./loader-config/pc');
const h5Loader = require('./loader-config/h5');
class Server {
    constructor( config ) {
        this.devConfig = config.devServer;
        this.config = config;
        this.init();
    }

    init() {
        webpackConfig.devServer = Object.assign( {}, webpackConfig.devServer, this.devConfig );
        let rules = webpackConfig.module.rules;
        webpackConfig.module.rules = ( this.config.pxtorem ? h5Loader : pcLoader ).concat( rules );

        let compiler = webpack( webpackConfig );
        let server = new WebpackDevServer( compiler, webpackConfig.devServer );
        this.getPort(  webpackConfig.devServer.port )
            .then( ( port ) => {
                server.listen( port, webpackConfig.devServer.host, () => {
                    console.log( 'running at:', `http://${ webpackConfig.devServer.host}:${webpackConfig.devServer.port}` );
                });
            } )
            .catch( ( error ) => {
                console.log( 'Something went wrong:', error );
            } );
    }

    // 端口被占用
    getPort( port ) {
        return new Promise( ( resolve, reject ) => {
            portfinder.basePort = port;
            portfinder.getPort( ( error, correctPort ) => {
                if ( error ) reject( reject );
                resolve( correctPort );
            } )
        } )
    }
}

module.exports = Server;