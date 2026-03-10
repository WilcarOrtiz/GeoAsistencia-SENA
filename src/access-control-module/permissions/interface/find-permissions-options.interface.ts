import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { EntityManager } from 'typeorm';

export interface FindPermissionsOptions {
  names?: string[];
  pagination?: PaginationDto;
  withRoles?: boolean;
  manager?: EntityManager;
}
