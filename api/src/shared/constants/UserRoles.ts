export const UserRoles = {
    USER: 'USER',
    ADMIN: 'ADMIN',
} as const;

export type Role = typeof UserRoles[keyof typeof UserRoles];

export const ROLES_LIST: Role[] = Object.values(UserRoles);
