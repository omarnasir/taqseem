export type ServiceResponse<T = any> = {
  success: boolean;
  error?: string;
  data?: T;
}