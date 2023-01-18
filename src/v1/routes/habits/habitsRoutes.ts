import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import dayjs from 'dayjs';
import { prisma } from '../../lib/prisma';

export default async function habitsRoutes(app: FastifyInstance) {
  app.post('/habits', async (request, reply) => {
    try {
      const createHabitBody = z.object({
        title: z.string(),
        weekDays: z.array(
          z.number(),
        ).min(0).max(6),
      });

      const { title, weekDays } = createHabitBody.parse(request.body);

      const today = dayjs().startOf('day').toDate();

      await prisma.habit.create({
        data: {
          title,
          created_at: today,
          weekDays: {
            create: weekDays.map((weekDay) => ({
              week_day: weekDay,
            })),
          },
        },
      });
      reply.status(200).send({ data: 'Created with success' });
    } catch (e) {
      reply.status(400).send({ error: 'Impossible to create an Habit.' });
    }
  });

  app.get('/day', async (request, reply) => {
    try {
      const getDayParams = z.object({
        date: z.coerce.date(), // coerce => converte o valor enviado
      });

      const { date } = getDayParams.parse(request.query);

      const parsedDate = dayjs(date).startOf('day');
      const weekDay = parsedDate.get('day');

      const possibleHabits = await prisma.habit.findMany({
        where: {
          created_at: {
            lte: date,
          },
          weekDays: {
            some: {
              week_day: weekDay,
            },
          },
        },
      });

      const day = await prisma.day.findUnique({
        where: {
          date: parsedDate.toDate(),
        },
        include: {
          dayHabits: true,
        },
      });

      const completedHabits = day?.dayHabits.map((dayHabit) => dayHabit.habit_id);

      reply.status(200).send({ data: { possibleHabits, completedHabits } });
    } catch (e) {
      reply.status(400).send({ error: e });
    }
  });
}
