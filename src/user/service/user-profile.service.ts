import { Injectable } from '@nestjs/common';
import { Role } from 'src/access-control-module/roles/entities/role.entity';
import { ValidRole } from 'src/common/enums/valid-role.enum';
import { Student } from 'src/student/entities/student.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { EntityManager, EntityTarget } from 'typeorm';

@Injectable()
export class UserProfileService {
  PROFILE_ENTITIES: Partial<Record<ValidRole, EntityTarget<any>>> = {
    [ValidRole.STUDENT]: Student,
    [ValidRole.TEACHER]: Teacher,
  };

  async createProfiles(manager: EntityManager, authId: string, roles: Role[]) {
    for (const role of roles) {
      const entityClass =
        this.PROFILE_ENTITIES[role.name.toUpperCase() as ValidRole];
      if (entityClass) await manager.save(entityClass, { auth_id: authId });
    }
  }

  async syncProfiles(manager: EntityManager, authId: string, newRoles: Role[]) {
    const newRoleNames = newRoles.map((r) => r.name.toUpperCase());

    for (const roleKey of Object.keys(this.PROFILE_ENTITIES)) {
      const entity = this.PROFILE_ENTITIES[roleKey] as EntityTarget<any>;
      const hasThisRole = newRoleNames.includes(roleKey);
      const existingProfile = await manager.findOneBy<Student | Teacher>(
        entity,
        { auth_id: authId },
      );

      if (hasThisRole) {
        if (!existingProfile)
          await manager.save(entity, { auth_id: authId, is_active: true });
        else
          await manager.update(
            entity,
            { auth_id: authId },
            { is_active: true },
          );
      } else if (existingProfile) {
        await manager.update(entity, { auth_id: authId }, { is_active: false });
      }
    }
  }
}
