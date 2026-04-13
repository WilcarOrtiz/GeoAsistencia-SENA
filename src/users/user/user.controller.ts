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
import { UserService } from './service/user.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import {
  CreateUserDto,
  FindAllUsersDto,
  PaginatedUserResponseDto,
  UpdateRolesUserDto,
  UpdateUserDto,
  UserBaseResponseDto,
  UserMeResponseDto,
  UserResponseWithRolesDto,
} from './dto';
import {
  GetUser,
  PublicAccess,
  RequiredPermissions,
} from 'src/common/decorators';
import { PermissionsGuard } from 'src/common/guard';
import { plainToInstance } from 'class-transformer';
import { RoleListItemDto } from 'src/access-control-module/roles/dto/roles-response.dto';
import type { ICurrentUser } from 'src/common/interface/current-user.interface';

@ApiBearerAuth('access-token')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @PublicAccess()
  @Get('is-active')
  @ApiOperation({
    summary: 'Verificar si un usuario está activo',
    description:
      'Recibe un correo y devuelve true o false si el usuario está activo.',
  })
  @ApiOkResponse({
    schema: { example: { isActive: true } },
  })
  async isActiveUser(@Query('email') email: string) {
    const isActive = await this.userService.isUserActiveByEmail(email);
    return { isActive };
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo usuario',
    description:
      'Crea un usuario en Supabase Auth y registra su información base en la base de datos. Asigna los roles indicados.',
  })
  @ApiOkResponse({ type: UserResponseWithRolesDto })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return plainToInstance(UserResponseWithRolesDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id/roles')
  @ApiOperation({
    summary: 'Actualizar roles de un usuario',
    description: 'Reemplaza completamente los roles asignados a un usuario.',
  })
  @ApiOkResponse({ type: [RoleListItemDto] })
  async updateUserRoles(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRolesUserDto: UpdateRolesUserDto,
  ) {
    const user = await this.userService.updateRoles(id, updateRolesUserDto);
    return plainToInstance(RoleListItemDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar información básica del usuario',
    description:
      'Actualiza los datos base del usuario (nombres, apellidos, estado, etc.) utilizando su auth_id. No modifica roles ni credenciales de autenticación.',
  })
  @ApiOkResponse({ type: UserBaseResponseDto })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userInfo = await this.userService.update(id, updateUserDto);
    return plainToInstance(UserBaseResponseDto, userInfo, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id/deactivate')
  @ApiOperation({
    summary: 'Desactivar usuario',
    description:
      'Marca el usuario como inactivo (is_active = false). No elimina registros ni credenciales.',
  })
  @ApiOkResponse({
    schema: {
      example: { is_active: false },
    },
  })
  async deactivate(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.setStatus(id, false);
  }

  @Patch(':id/activate')
  @ApiOperation({
    summary: 'Activar usuario',
    description:
      'Reactiva un usuario previamente desactivado (is_active = true). Valida que el usuario exista y que no esté activo previamente..',
  })
  @ApiOkResponse({
    schema: {
      example: { is_active: true },
    },
  })
  async activate(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.setStatus(id, true);
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
  @ApiOkResponse({ type: UserMeResponseDto })
  async getProfile(@GetUser() user: ICurrentUser) {
    return await this.userService.getUserProfile(user);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un usuario',
  })
  @ApiOkResponse({ type: UserResponseWithRolesDto })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const userInfo = await this.userService.findOne(id);
    return plainToInstance(UserResponseWithRolesDto, userInfo, {
      excludeExtraneousValues: true,
    });
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
* **3:** Paginación (page, limit).
`,
  })
  @ApiOkResponse({ type: PaginatedUserResponseDto })
  async findAll(
    @Query() findAllUsersDto: FindAllUsersDto,
  ): Promise<PaginatedUserResponseDto> {
    console.log('query params:', findAllUsersDto);
    const result = await this.userService.findAll(findAllUsersDto);

    return {
      ...result,
      data: plainToInstance(UserResponseWithRolesDto, result.data, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
    };
  }
}

//TODO: borrar todo lo referente a   GetAccessCriteria y AccessCriteria,
// 1. revisar lo de la opocion de mandar correo de actualizaicon para un uesuario
