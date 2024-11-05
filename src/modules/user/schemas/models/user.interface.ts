export interface InterfaceUser {
  id?: string;
  username: string;
  name: string;
  password: string;
}

// returned on public routes
export type PublicInterfaceUser = Omit<InterfaceUser, 'password'>;
