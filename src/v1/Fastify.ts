import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { habitsRoutes } from './routes/routes';

class App {
  declare fastify: FastifyInstance;

  constructor() {
    // Creating the Fastify Instance
    this.fastify = Fastify({
      logger: true,
    });
    // Setting global middlewares in this method.
    this.middlewares();
    // Setting the api routes.
    this.routes();
  }

  private async middlewares() {
    // Middleware of CORS
    await this.fastify.register(cors, {
      origin: true,
    });
  }

  private routes() {
    // Register routes of API
    this.fastify.register(habitsRoutes); // { prefix: '/.netlify/functions/server' }
  }
}

export default new App().fastify;
