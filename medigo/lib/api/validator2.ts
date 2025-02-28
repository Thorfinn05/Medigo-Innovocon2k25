import { ValidationError } from './errors2';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

export function validateFile(file: File) {
  if (!file) {
    throw new ValidationError('No file provided');
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new ValidationError(
      `Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new ValidationError(
      `File size exceeds limit. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`
    );
  }
}