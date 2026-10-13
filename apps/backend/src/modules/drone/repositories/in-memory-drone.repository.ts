import { randomUUID } from 'crypto';
import { DroneEntity, DroneRepository } from '@sokil/contracts';

export class InMemoryDroneRepository implements DroneRepository {
  private drones: DroneEntity[] = [];

  async findAll(): Promise<DroneEntity[]> {
    return this.drones;
  }

  async findOne(id: string): Promise<DroneEntity | null> {
    const drone = this.drones.find((d) => d._id === id);
    return drone || null;
  }

  async create(drone: Partial<DroneEntity>): Promise<DroneEntity> {
    const newDrone = {
      _id: randomUUID(),
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
      ...drone,
    } as DroneEntity;
    this.drones.push(newDrone);

    console.log(this.drones);
    return newDrone;
  }

  async update(id: string, drone: Partial<DroneEntity>): Promise<DroneEntity> {
    const index = this.drones.findIndex((d) => d._id === id);
    if (index === -1) {
      throw new Error(`Drone with id ${id} not found`);
    }
    this.drones[index] = {
      ...this.drones[index],
      ...drone,
      _updatedAt: new Date().toISOString(),
    };
    return this.drones[index];
  }

  async delete(id: string): Promise<void> {
    const index = this.drones.findIndex((d) => d._id === id);
    if (index === -1) {
      throw new Error(`Drone with id ${id} not found`);
    }
    this.drones.splice(index, 1);
  }
}
