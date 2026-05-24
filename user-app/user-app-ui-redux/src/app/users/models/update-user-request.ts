export interface UpdateUserRequest {
  id?: number;
  name: string;
  lastName: string;
  email: string;
  username: string;
  password?: string;
}