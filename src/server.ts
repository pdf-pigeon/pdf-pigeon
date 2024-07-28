import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { RENDER_PDF_POST, RENDER_PNG_POST } from './routes';

export async function startServer() {
  const server = fastify({
    caseSensitive: false,
    ignoreDuplicateSlashes: true,
    ignoreTrailingSlash: true,
    logger: process.env.DEBUG ? true : false,
  });

  await server.register(fastifyCors, {
    allowedHeaders: '*',
    origin: '*',
  });

  await server.register(fastifySwagger, {
    swagger: {
      consumes: ['application/json'],
      host: process.env.HOST || 'localhost:8080',
      info: {
        description: 'HTML to PDF in under 2 seconds',
        title: 'PDF Pigeon API Specification',
        version: '0.1.0',
      },
      produces: ['application/json'],
      schemes: process.env.DEBUG ? ['http'] : ['https', 'http'],
      externalDocs: {
        url: 'https://github.com/pdf-pigeon/pdf-pigeon',
        description: 'View Offical Documentation',
      },
    },
  });

  await server.register(fastifySwaggerUi, {
    routePrefix: '/docs',
  });

  server.route(RENDER_PDF_POST);

  server.route(RENDER_PNG_POST);

  server.route({
    handler: async (request, reply) => {
      reply.redirect('/docs', 302);
    },
    method: 'GET',
    url: '/',
    schema: {
      tags: ['X-HIDDEN'],
    },
  });

  let healthy: boolean = true;

  server.route({
    handler: async (request, reply) => {
      if (!healthy) {
        reply.status(503).send();

        return;
      }

      reply.status(200).send();
    },
    method: 'GET',
    url: '/api/v1/health',
  });

  server.route({
    handler: async (request, reply) => {
      healthy = !healthy;

      reply.status(200).send(healthy);
    },
    method: 'POST',
    url: '/api/v1/health',
    schema: {
      tags: ['X-HIDDEN'],
    },
  });

  server.route({
    handler: async (request, reply) => {
      reply.status(200).send();
    },
    method: 'GET',
    url: '/api/v1/ping',
  });

  await server.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? parseInt(process.env.PORT) : 8080,
  });

  await server.ready();
}
