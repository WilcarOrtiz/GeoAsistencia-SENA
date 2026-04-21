import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './user.controller';
import { AccessControlModuleModule } from 'src/access-control-module/access-control-module.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { User } from './entities/user.entity';
import { UserProfileService } from './service/user-profile.service';
import { UserBulkService } from './service/user-bulk.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserProfileService, UserBulkService],
  imports: [
    TypeOrmModule.forFeature([User]),
    AccessControlModuleModule,
    AuthModule,
  ],
  exports: [TypeOrmModule, UserService, UserProfileService],
})
export class UserModule {}

/*
Para LECTURA (findOne, findAll, getUserProfile): Sigue usando QueryBuilder. Es lo más eficiente. En bases de datos relacionales, el usuario es el eje central y es normal que "conozca" sus extensiones (Estudiante/Profesor) para mostrar la información rápido.
Tip: Solo selecciona las columnas que realmente necesitas con .select(), no traigas toda la entidad si no la usas
Para ESCRITURA (createUser, updateRoles): Usa Servicios o Eventos. Aquí el rendimiento de milisegundos no es tan crítico como la integridad de los datos. Si un createUser tarda 200ms en lugar de 100ms por llamar a otro servicio, no importa, siempre que la lógica sea sólida.
*/
