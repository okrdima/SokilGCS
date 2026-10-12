import { PartialType } from '@nestjs/mapped-types';
import { CreateDroneDto } from './create-drone.dto';

export class UpdateDroneDto extends PartialType(CreateDroneDto) {}
