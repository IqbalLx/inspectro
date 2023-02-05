import { server as app } from './build/index.js';

function shutdownGracefully() {
	console.log('Server doing graceful shutdown');
	app.server.close();
}

process.on('SIGINT', shutdownGracefully);
process.on('SIGTERM', shutdownGracefully);
