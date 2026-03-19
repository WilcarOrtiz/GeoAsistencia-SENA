import { ApiProperty } from '@nestjs/swagger';

export class NavigationItemDto {
  @ApiProperty({ example: 'uuid-123' })
  id: string;

  @ApiProperty({ example: 'Dashboard' })
  name: string;

  @ApiProperty({ example: '/dashboard', nullable: true })
  route: string | null;

  @ApiProperty({ example: 'dashboard-icon', nullable: true })
  icon: string | null;

  @ApiProperty({ example: 1 })
  order_index: number;

  @ApiProperty({ type: () => [NavigationItemDto] })
  children: NavigationItemDto[];
}
