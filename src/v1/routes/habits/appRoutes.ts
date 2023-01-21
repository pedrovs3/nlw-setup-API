import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import dayjs from 'dayjs';
import { prisma } from '../../lib/prisma';

export default async function appRoutes(app: FastifyInstance) {
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

      const habitCreated = await prisma.habit.create({
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

      reply.status(200).send({
        data: {
          message: 'Created with success',
          id: habitCreated.id,
        },
      });
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

      const completedHabits = day?.dayHabits.map((dayHabit) => dayHabit.habit_id) ?? [];

      reply.status(200).send({ data: { possibleHabits, completedHabits } });
    } catch (e) {
      reply.status(400).send({ error: e });
    }
  });

  // Toggle habit
  app.patch('/habits/:id/toggle', async (request, reply) => {
    try {
      const tooggleHabitParams = z.object({
        id: z.string().uuid(),
      });

      const { id } = tooggleHabitParams.parse(request.params);

      const today = dayjs().startOf('day').toDate();

      let day = await prisma.day.findUnique({
        where: {
          date: today,
        },
      });

      if (!day) {
        day = await prisma.day.create({
          data: {
            date: today,
          },
        });
      }

      const dayHabit = await prisma.dayHabit.findUnique({
        where: {
          day_id_habit_id: {
            day_id: day.id,
            habit_id: id,
          },
        },
      });

      if (dayHabit) {
        // Remove the complete check
        await prisma.dayHabit.delete({
          where: {
            id: dayHabit.id,
          },
        });
      } else {
        // Complete habit on this day
        await prisma.dayHabit.create({
          data: {
            day_id: day.id,
            habit_id: id,
          },
        });
      }
      reply.status(200).send({
        data: {
          message: 'Updated with success!',
        },
      });
    } catch (e) {
      reply.status(400).send({ error: e });
    }
  });

  app.get('/summary', async (request, reply) => {
    try {
      // Query mais complexos, mais relacionamentos etc => SQL na mao (RAW)
      const summary = await prisma.$queryRaw`
        SELECT 
            Days.id, 
            Days.date,
            CAST(COUNT(tbl_days_habits.id) AS float) AS completed,
            (
            SELECT cast(count(tbl_habit_week_days.id) as float)
            FROM tbl_habit_week_days
            JOIN tbl_habits ON tbl_habits.id = tbl_habit_week_days.habit_id
            WHERE tbl_habit_week_days.week_day = date_format(Days.date, '%w') AND tbl_habits.created_at <= Days.date
            ) as amount
        FROM tbl_days Days
        INNER JOIN tbl_days_habits ON tbl_days_habits.day_id = Days.id
        GROUP BY Days.id, Days.date;
      `;
      reply.send({ data: summary });
    } catch (e) {
      reply.status(400).send({ error: e });
    }
  });
}
