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
import { EnrollmentService } from '../class-group/enrollment/service/enrollment.service';

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
      // =========================
      // 1. BORRADO (orden inverso)
      // =========================
      await this.attendancesService.removeSeed(manager);
      await this.classSessionsService.removeSeed(manager);
      await this.enrollmentService.removeSeed(manager);
      await this.classDaysService.removeSeed(manager);
      await this.classGroupsService.removeSeed(manager);

      await this.teacherService.removeSeed(manager);
      await this.studentService.removeSeed(manager);

      await this.subjectsService.removeSeed(manager);
      await this.semesterService.removeSeed(manager);

      await this.userService.deleteAllUser(manager);

      await this.rolesService.deleteAllRoles(manager);
      await this.menuService.deleteAll(manager);
      await this.permissionService.deleteAll(manager);

      // =========================
      // 2. CREACIÓN (orden correcto)
      // =========================

      // 🔐 1. permissions primero
      for (const permission of initialData.permissions) {
        await this.permissionService.create(permission, manager);
      }

      // 🔐 2. roles después
      for (const role of initialData.roles) {
        await this.rolesService.create(role, manager);
      }

      // 📋 3. menus después de permissions
      const parentMenus = initialData.menus.filter((m) => !m.parent_name);
      const createdParentsMap = new Map<string, string>();

      for (const menuDto of parentMenus) {
        const created = await this.menuService.create(menuDto, manager);
        createdParentsMap.set(created.name, created.id);
      }

      const childMenus = initialData.menus.filter((m) => m.parent_name);

      for (const menuDto of childMenus) {
        const parentId = createdParentsMap.get(menuDto.parent_name!);
        await this.menuService.create(
          { ...menuDto, parent_id: parentId },
          manager,
        );
      }

      // 👤 4. users
      // 👨‍🏫 5. teachers
      // 🎓 6. students

      // 📚 7. academic base
      // 🏫 8. groups
      // 📅 9. days
      // 📆 10. sessions
      // 🧾 11. enrollments
      // 📊 12. attendances

      return 'SEED OK';
    });
  }
}
