import { FastifyInstance } from 'fastify';
import { prisma } from '../../lib/prisma';

export default async function habitsRoutes(fastify: FastifyInstance) {
  fastify.get('/habits', async (request, reply) => {
    try {
      const habits = await prisma.habit.findMany();

      reply.status(200).send({ data: habits });
    } catch (e) {
      reply.status(400).send({ error: e });
    }
  });
}
