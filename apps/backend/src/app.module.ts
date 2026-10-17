import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DroneModule } from './modules/drone/drone.module';
import { APP_PIPE,APP_FILTER } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { ZodExceptionFilter }from './common/pipes'

import { TelemetryModule } from './telemetry/telemetry.module';

@Module({
  imports: [DroneModule, TelemetryModule],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    { provide: APP_FILTER, useClass: ZodExceptionFilter },
  ],
})
export class AppModule {}
