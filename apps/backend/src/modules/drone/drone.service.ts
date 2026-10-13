import { Injectable } from '@nestjs/common';
import { CreateDroneDto } from './dto/create-drone.dto';
import { UpdateDroneDto } from './dto/update-drone.dto';
import { DroneRepository, DroneEntity } from '@sokil/contracts';

@Injectable()
export class DroneService {
  constructor(private readonly droneRepository: DroneRepository) {}

  async create(createDroneDto: CreateDroneDto): Promise<DroneEntity> {
    return this.droneRepository.create(createDroneDto);
  }

  async findAll(): Promise<DroneEntity[]> {
    return this.droneRepository.findAll();
  }

  async findOne(id: string): Promise<DroneEntity | null> {
    return this.droneRepository.findOne(id);
  }

  async update(id: string, updateDroneDto: UpdateDroneDto): Promise<DroneEntity> {
    return this.droneRepository.update(id, updateDroneDto);
  }

  async remove(id: string): Promise<void> {
    return this.droneRepository.delete(id);
  }
}
