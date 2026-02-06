// Define primero el ítem de navegación para que pueda referenciarse a sí mismo
export class NavigationItemDto {
  id: string;
  name: string;
  route: string | null;
  icon: string | null;
  order_index: number;
  children: NavigationItemDto[]; // <--- RECURSIVIDAD: Un ítem contiene una lista de sí mismo
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

  // Ahora navigation usa el tipo recursivo
  navigation: NavigationItemDto[];
}
