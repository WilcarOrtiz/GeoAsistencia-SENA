import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class NavigationItemDto {
  @Expose()
  @ApiProperty({ example: 'uuid-123' })
  id!: string;

  @Expose()
  @ApiProperty({ example: 'Dashboard' })
  name!: string;

  @Expose()
  @ApiProperty({ example: '/dashboard', nullable: true })
  route!: string | null;

  @Expose()
  @ApiProperty({ example: 'dashboard-icon', nullable: true })
  icon!: string | null;

  @Expose()
  @ApiProperty({ example: 1 })
  order_index!: number;

  @Expose()
  @Type(() => NavigationItemDto)
  @ApiProperty({ type: () => [NavigationItemDto] })
  children!: NavigationItemDto[];
}
