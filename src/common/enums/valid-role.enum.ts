export enum ValidRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}

export const ROLE_SYSTEM_KEYS = Object.values(ValidRole) as ValidRole[];
