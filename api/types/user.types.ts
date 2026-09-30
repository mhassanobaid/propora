export type AuthProvider = "local" | "google";

export interface IUser {
  username: string;
  email: string;
  password?: string;
  avatar?: string;
  firebaseUid?: string;
  authProvider: AuthProvider;
}
