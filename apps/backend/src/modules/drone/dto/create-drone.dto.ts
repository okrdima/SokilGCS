import { createZodDto } from 'nestjs-zod';
import { CreateDroneSchema } from "@sokil/contracts"


// 2. Export the Class DTO generated from the schema
export class CreateDroneDto extends createZodDto(CreateDroneSchema) {}
