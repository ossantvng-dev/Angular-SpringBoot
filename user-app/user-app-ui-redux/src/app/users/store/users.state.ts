import { User } from '../models/user';

export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
}

export const initialUsersState: UsersState = {
  users: [],
  loading: false,
  error: null,
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  pageSize: 5,
};
