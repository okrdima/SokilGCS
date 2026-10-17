import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json } from 'express';
import { AppModule } from './app.module';
import { validateEnv } from './config/env';

async function bootstrap() {
  const env = validateEnv();
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '1mb' }));
  app.enableShutdownHooks();

  await app.listen(env.PORT);
  logger.log(`Application listening on port ${env.PORT}`);
}
void bootstrap();
