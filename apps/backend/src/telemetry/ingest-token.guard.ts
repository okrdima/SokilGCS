import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash, timingSafeEqual } from 'node:crypto';
import type { Request } from 'express';
import { validateEnv } from '../config/env';

@Injectable()
export class IngestTokenGuard implements CanActivate {
  private readonly logger = new Logger(IngestTokenGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const env = validateEnv();

    if (!env.INGEST_TOKEN) {
      this.logger.warn('Ingest requested but INGEST_TOKEN is not configured');
      throw new ServiceUnavailableException(
        'Ingest endpoint is disabled because INGEST_TOKEN is not configured',
      );
    }

    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey || typeof apiKey !== 'string') {
      throw new UnauthorizedException('Missing x-api-key header');
    }

    const expectedHash = createHash('sha256').update(env.INGEST_TOKEN).digest();
    const providedHash = createHash('sha256').update(apiKey).digest();

    if (!timingSafeEqual(expectedHash, providedHash)) {
      throw new UnauthorizedException('Invalid x-api-key');
    }

    return true;
  }
}
