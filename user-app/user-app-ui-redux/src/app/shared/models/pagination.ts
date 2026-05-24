export interface Pagination<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  pageNumber: number;
  pageSize: number;
}
