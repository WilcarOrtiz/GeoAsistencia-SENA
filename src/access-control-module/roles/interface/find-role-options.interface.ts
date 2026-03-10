import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { EntityManager } from 'typeorm';

export interface FindRoleOptions {
  ids?: string[];
  withPermissions?: boolean;
  pagination?: PaginationDto;
  manager?: EntityManager;
}
