import { Injectable } from '@nestjs/common';
import { CreateDroneDto } from './dto/create-drone.dto';
import { UpdateDroneDto } from './dto/update-drone.dto';

@Injectable()
export class DroneService {
  create(_createDroneDto: CreateDroneDto) {
    return 'This action adds a new drone';
  }

  findAll() {
    return `This action returns all drone`;
  }

  findOne(id: number) {
    return `This action returns a #${id} drone`;
  }

  update(id: number, _updateDroneDto: UpdateDroneDto) {
    return `This action updates a #${id} drone`;
  }

  remove(id: number) {
    return `This action removes a #${id} drone`;
  }
}
