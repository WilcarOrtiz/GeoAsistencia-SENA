import { ClassGroupsService } from './../class-group/class-groups/class-groups.service';
import { ClassDaysService } from './../class-group/class-days/class-days.service';
import { Injectable } from '@nestjs/common';
import { PermissionsService } from 'src/access-control-module/permissions/permissions.service';
import { initialData } from './data/seed-data';
import { RolesService } from 'src/access-control-module/roles/roles.service';
import { DataSource } from 'typeorm';
import { MenuService } from '../access-control-module/menu/menu.service';
import { UserService } from 'src/users/user/service/user.service';
import { SemesterService } from '../academic/semester/semester.service';
import { SubjectsService } from '../academic/subjects/subjects.service';
import { TeacherService } from '../users/teacher/teacher.service';
import { StudentService } from '../users/student/student.service';
import { AttendancesService } from '../class-group/attendances/attendances.service';
import { ClassSessionsService } from '../class-group/class-sessions/class-sessions.service';
import { EnrollmentService } from '../class-group/enrollment/enrollment.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly dataSource: DataSource,

    //Access Control Module
    private readonly permissionService: PermissionsService,
    private readonly rolesService: RolesService,
    private readonly menuService: MenuService,

    //Academico
    private readonly semesterService: SemesterService,
    private readonly subjectsService: SubjectsService,

    //User
    private readonly userService: UserService,
    private readonly teacherService: TeacherService,
    private readonly studentService: StudentService,

    // Class Group
    private readonly attendancesService: AttendancesService,
    private readonly classDaysService: ClassDaysService,
    private readonly classGroupsService: ClassGroupsService,
    private readonly classSessionsService: ClassSessionsService,
    private readonly enrollmentService: EnrollmentService,
  ) {}

  async runSeed() {
    return await this.dataSource.transaction(async (manager) => {
      // 1. LO MÁS DEPENDIENTE (hijos extremos)
      await this.attendancesService.removeSeed(manager);

      // 2. sesiones y asistencia dependen de esto
      await this.classSessionsService.removeSeed(manager);

      // 3. matrícula depende de grupos y estudiantes
      await this.enrollmentService.removeSeed(manager);

      // 4. días dependen de grupos
      await this.classDaysService.removeSeed(manager);

      // 5. grupos (dependen de teacher, subject, semester)
      await this.classGroupsService.removeSeed(manager);

      // 6. ahora sí entidades base relacionadas
      await this.teacherService.removeSeed(manager);
      await this.studentService.removeSeed(manager);

      // 7. entidades independientes académicas
      await this.subjectsService.removeSeed(manager);
      await this.semesterService.removeSeed(manager);

      // 8. seguridad (usuarios dependen de roles/permisos)
      await this.userService.deleteAllUser(manager);
      await this.rolesService.deleteAllRoles(manager);
      await this.menuService.deleteAll(manager);
      await this.permissionService.deleteAll(manager);

      for (const permission of initialData.permissions) {
        await this.permissionService.create(permission, manager);
      }

      for (const role of initialData.roles) {
        await this.rolesService.create(role, manager);
      }

      const parentMenus = initialData.menus.filter((m) => !m.parent_name);
      const createdParentsMap = new Map<string, string>();

      for (const menuDto of parentMenus) {
        const created = await this.menuService.create(menuDto, manager);
        createdParentsMap.set(created.name, created.id);
      }

      const childMenus = initialData.menus.filter((m) => m.parent_name);

      for (const menuDto of childMenus) {
        const parentId = createdParentsMap.get(menuDto.parent_name!);
        if (!parentId)
          throw new Error(
            `No se encontró el ID del padre para el menú: ${menuDto.name}`,
          );

        await this.menuService.create(
          {
            ...menuDto,
            parent_id: parentId,
          },
          manager,
        );
      }
      return 'SEED EXECUTED SUCCESSFULLY';
    });
  }
}
