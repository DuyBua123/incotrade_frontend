export interface Pageable {
  currentPage: number,
  pageSize: number,
  totalItems: number,
  totalPages: number,
  hasNext: boolean,
  hasPrevious: boolean
}

export interface PageableResponse<T> {
  items: T,
  pagination: Pageable
}

export interface SuccessResponse<T> {
  message: string;
  data: T;
  timestamp: string;
}