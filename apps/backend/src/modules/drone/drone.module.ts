import { Module } from '@nestjs/common';
import { DroneService } from './drone.service';
import { DroneController } from './drone.controller';

@Module({
  controllers: [DroneController],
  providers: [DroneService],
})
export class DroneModule {}
