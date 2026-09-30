export type AuthProvider = "local" | "google";

export interface IUser {
  username: string;
  email: string;
  password?: string;
  avatar?: string;
  avatarPublicId?: string,
  firebaseUid?: string;
  authProvider: AuthProvider;

  createdAt: Date;
  updatedAt: Date;
}
