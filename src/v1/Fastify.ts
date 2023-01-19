import Fastify, {FastifyInstance} from 'fastify';
import cors from '@fastify/cors';
import {appRoutes} from './routes/routes';

class App {
	declare app: FastifyInstance;

	constructor() {
		// Creating the Fastify Instance
		this.app = Fastify({
			logger: true,
		});
		// Setting global middlewares in this method.
		this.middlewares();
		// Setting the api routes.
		this.routes();
	}

	private async middlewares() {
		// Middleware of CORS
		await this.app.register(cors, {
			origin: true,
		});
	}

	private routes() {
		// Register routes of API
		this.app.register(appRoutes, {prefix: '/.netlify/functions/server'});
	}
}

export default new App().app;
