import fastify from '../v1/Fastify';

const run = async () => {
  try {
    await fastify.listen({
      port: 3333,
      host: '0.0.0.0',
    }).then(() => console.log('Running'));
  } catch (e) {
    process.exit(1);
  }
};

run();

export default fastify;

// ZOD schema
// const userSchema = z.object({
//     name: z.string().min(3).max(50),
//     email: z.string().email(),
//     password: z.string().min(8).max(50)
// })
