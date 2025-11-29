export type UserRole = 'admin' | 'coach';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
}
