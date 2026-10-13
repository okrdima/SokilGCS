import type { DroneEntity } from '../entities/drone.entity';

export abstract class DroneRepository {
  abstract findAll(): Promise<DroneEntity[]>;
  abstract findOne(id: string): Promise<DroneEntity | null>;
  abstract create(drone: Partial<DroneEntity>): Promise<DroneEntity>;
  abstract update(id: string, drone: Partial<DroneEntity>): Promise<DroneEntity>;
  abstract delete(id: string): Promise<void>;
}
