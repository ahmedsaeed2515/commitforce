/**
 * Standardized API Response Format
 */
class ApiResponse {
  public success: boolean;
  public message: string;
  public data?: any;
  public errors?: any[];

  constructor(
    success: boolean,
    message: string,
    data?: any,
    errors?: any[]
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errors = errors;
  }

  static success(message: string = 'Success', data?: any) {
    return new ApiResponse(true, message, data);
  }

  static error(message: string = 'Error', errors?: any[]) {
    return new ApiResponse(false, message, undefined, errors);
  }

  static created(message: string = 'Resource created successfully', data?: any) {
    return new ApiResponse(true, message, data);
  }

  static updated(message: string = 'Resource updated successfully', data?: any) {
    return new ApiResponse(true, message, data);
  }

  static deleted(message: string = 'Resource deleted successfully') {
    return new ApiResponse(true, message);
  }
}

export default ApiResponse;
