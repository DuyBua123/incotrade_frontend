
export interface PageableResponse<T> {
  items: T,
  pagination: string
}

export interface SuccessResponse<T> {
  message: string;
  data: T;
  timestamp: string;
}