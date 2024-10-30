import { ApiError } from '../types/api';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const SUPPORTED_FORMATS = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/markdown'
];

export class FileService {
  static validateFile(file: File): void {
    if (file.size > MAX_FILE_SIZE) {
      throw new ApiError(`File size exceeds limit (${Math.floor(MAX_FILE_SIZE / 1024 / 1024)}MB)`, 400);
    }

    if (!SUPPORTED_FORMATS.includes(file.type)) {
      throw new ApiError('Unsupported file format', 400);
    }
  }

  static async readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new ApiError('Failed to read file content', 500));
        }
      };
      
      reader.onerror = () => {
        reject(new ApiError('Error reading file', 500));
      };
      
      reader.readAsText(file);
    });
  }
}