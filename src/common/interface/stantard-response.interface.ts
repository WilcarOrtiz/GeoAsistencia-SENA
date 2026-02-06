export interface StandardResponse<T> {
  ok: boolean;
  message: string;
  data: T | null;
}
