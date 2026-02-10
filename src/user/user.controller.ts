import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateRolesUserDto } from './dto/update-roles-user.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { RequiredPermissions } from 'src/common/decorators/permissions.decorator';
import {
  AccessCriteria,
  GetAccessCriteria,
} from 'src/common/decorators/get-access-criteria.decorator';
import { PermissionsGuard } from 'src/common/guard/PermissionsGuard.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@ApiBearerAuth('access-token')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo usuario',
    description:
      'Crea un usuario en Supabase Auth y registra su información base en la base de datos. Asigna los roles indicados.',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Patch(':id/roles')
  @ApiOperation({
    summary: 'Actualizar roles de un usuario',
    description: 'Reemplaza completamente los roles asignados a un usuario.',
  })
  updateUserRoles(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRolesUserDto: UpdateRolesUserDto,
  ) {
    return this.userService.updateRoles(id, updateRolesUserDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar información básica del usuario',
    description:
      'Actualiza los datos base del usuario (nombres, apellidos, estado, etc.) utilizando su auth_id. No modifica roles ni credenciales de autenticación.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Patch(':id/deactivate')
  @ApiOperation({
    summary: 'Desactivar usuario',
    description:
      'Marca el usuario como inactivo (is_active = false). No elimina registros ni credenciales.',
  })
  deactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.deactivate(id);
  }

  @Patch(':id/activate')
  @ApiOperation({
    summary: 'Activar usuario',
    description:
      'Reactiva un usuario previamente desactivado (is_active = true). Valida que el usuario exista y que no esté activo previamente..',
  })
  activate(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.activate(id);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Obtener perfil detallado',
    description: `
  Retorna la información completa del usuario procesando la jerarquía de seguridad.
  
  **Lo que incluye esta respuesta:**
  * **Roles asignados:** Lista de roles vinculados al usuario.
  * **Permisos efectivos:** Cálculo de permisos únicos (evita duplicidad si varios roles comparten permisos).
  * **Menú de navegación:** Estructura dinámica basada en los permisos obtenidos.
  * **Nombre Completo:** Campo calculado que concatena nombre y apellidos.
  `,
  })
  getProfile(@GetUser('authId') authId: string) {
    return this.userService.getUserProfile(authId);
  }

  @Get()
  @RequiredPermissions('ver_asignaturas')
  @UseGuards(PermissionsGuard)
  @ApiOperation({
    summary: 'Listar usuarios',
    description: `
  Obtiene una lista paginada de usuarios con soporte para:.

  * **1:** Inclusión opcional de usuarios inactivos.
  * **2:** Filtro por rol.
  * **3:** Paginación (limit, offset).
  `,
  })
  findAll(
    @Query() findAllUsersDto: FindAllUsersDto,
    @GetAccessCriteria() accessCriteria: AccessCriteria,
  ) {
    return this.userService.findAll(findAllUsersDto, accessCriteria);
  }
}

//TODO: verificar si pornelos global o que los guard
