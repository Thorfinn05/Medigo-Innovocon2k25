export class APIError extends Error {
    constructor(
      message: string,
      public statusCode: number,
      public code: string
    ) {
      super(message);
      this.name = 'APIError';
    }
  }
  
  export class ValidationError extends APIError {
    constructor(message: string) {
      super(message, 400, 'VALIDATION_ERROR');
    }
  }
  
  export class FileProcessingError extends APIError {
    constructor(message: string) {
      super(message, 400, 'FILE_PROCESSING_ERROR');
    }
  }
  
  export class GeminiAPIError extends APIError {
    constructor(message: string) {
      super(message, 500, 'GEMINI_API_ERROR');
    }
  }
  
  export function handleError(error: unknown) {
    if (error instanceof APIError) {
      return { error: error.message, code: error.code, statusCode: error.statusCode };
    }
  
    console.error('Unexpected error:', error);
    return {
      error: 'An unexpected error occurred',
      code: 'INTERNAL_SERVER_ERROR',
      statusCode: 500,
    };
  }