import { FastifyReply, RouteOptions } from 'fastify';
import { Page } from 'puppeteer';
import { getBrowserPage, getContainer } from '../core';

async function handle(request: any, reply: FastifyReply): Promise<void> {
  const container = await getContainer();

  if (
    (!request.body.html && !request.body.url) ||
    (request.body.html && request.body.url)
  ) {
    reply
      .status(400)
      .send({ message: `please provide the property 'html' or 'url'` });

    return;
  }

  const page: Page = await getBrowserPage(
    container.browser,
    request.body.html || null,
    request.body.url || null,
    { height: 768, width: 1024 },
  );

  try {
    const buffer: Buffer = await page.screenshot({
      fullPage: true,
      type: 'png',
    });

    reply.status(200).header('Content-Type', 'application/pdf').send(buffer);
  } finally {
    await page.close();
  }
}

export const RENDER_PNG_POST: RouteOptions = {
  handler: handle,
  method: 'POST',
  url: '/api/v1/render/png',
  schema: {
    tags: ['render'],
    body: {
      type: 'object',
      properties: {
        footer: { type: 'string', nullable: true },
        header: { type: 'string', nullable: true },
        html: { type: 'string', nullable: true },
        margin: {
          type: 'object',
          nullable: true,
          properties: {
            bottom: { type: 'string', nullable: true },
            left: { type: 'string', nullable: true },
            right: { type: 'string', nullable: true },
            top: { type: 'string', nullable: true },
          },
        },
        url: { type: 'string', nullable: true },
      },
    },
  },
};
