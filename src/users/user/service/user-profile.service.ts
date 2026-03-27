import { Injectable } from '@nestjs/common';
import { Role } from 'src/access-control-module/roles/entities/role.entity';
import { ValidRole } from 'src/common/enums/valid-role.enum';
import { Student } from 'src/users/student/entities/student.entity';
import { Teacher } from 'src/users/teacher/entities/teacher.entity';
import { EntityManager, EntityTarget } from 'typeorm';

@Injectable()
export class UserProfileService {
  private readonly PROFILE_ENTITIES: Partial<
    Record<ValidRole, EntityTarget<any>>
  > = {
    [ValidRole.STUDENT]: Student,
    [ValidRole.TEACHER]: Teacher,
  };

  async createProfiles(manager: EntityManager, authId: string, roles: Role[]) {
    for (const role of roles) {
      const entity = this.getEntityForRole(role.name);
      if (entity) await manager.save(entity, { auth_id: authId });
    }
  }

  async syncProfiles(manager: EntityManager, authId: string, newRoles: Role[]) {
    const newRoleNames = new Set(newRoles.map((r) => r.name.toUpperCase()));

    for (const [roleKey, entity] of Object.entries(this.PROFILE_ENTITIES)) {
      await this.syncSingleProfile(
        manager,
        authId,
        entity,
        newRoleNames.has(roleKey),
      );
    }
  }

  private getEntityForRole(roleName: string): EntityTarget<any> | undefined {
    return this.PROFILE_ENTITIES[roleName.toUpperCase() as ValidRole];
  }

  private async syncSingleProfile(
    manager: EntityManager,
    id: string,
    entity: EntityTarget<any>,
    shouldBeActive: boolean,
  ) {
    if (shouldBeActive) {
      await manager.upsert(entity, { auth_id: id, is_active: true }, [
        'auth_id',
      ]);
    } else {
      await manager.update(entity, { auth_id: id }, { is_active: false });
    }
  }
}
