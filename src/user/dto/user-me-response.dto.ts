export class NavigationItemDto {
  id: string;
  name: string;
  route: string | null;
  icon: string | null;
  order_index: number;
  children: NavigationItemDto[];
}

export class UserMeResponseDto {
  user: {
    id: string;
    authId: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    secondLastName?: string;
    fullName: string;
    isActive: boolean;
  };

  roles: Array<{
    id: string;
    name: string;
    description: string;
  }>;

  permissions: string[];
  navigation: NavigationItemDto[];
}
