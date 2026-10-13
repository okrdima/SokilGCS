import { Module } from '@nestjs/common';
import { DroneService } from './drone.service';
import { DroneController } from './drone.controller';
import { InMemoryDroneRepository } from './repositories/in-memory-drone.repository';
import { DroneRepository } from './repositories/drone.repository';

@Module({
  controllers: [DroneController],
  providers: [
    DroneService,
    {
      provide: DroneRepository,
      useClass: InMemoryDroneRepository,
    },
  ],
})
export class DroneModule {}
